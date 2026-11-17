import sql, { getPool } from "../config/db.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

// Tanggal diformat di SQL agar tidak bergeser zona waktu
const fmtDate = (col, alias) => `CONVERT(VARCHAR(16), ${col}, 120) AS ${alias}`;

const SELECT_REQUESTS = `
  SELECT
    r.request_id, r.device_id, d.device_name,
    r.line_code, LTRIM(RTRIM(l.line_name)) AS line_name,
    r.old_asset_info, r.quantity, r.reason, r.status,
    r.requested_by, ${fmtDate("r.request_date", "request_date")},
    r.reviewed_by, ${fmtDate("r.review_date", "review_date")}, r.review_note,
    ISNULL(o.current_stock, 0) AS current_stock,
    CASE WHEN o.device_id IS NULL THEN 0 ELSE 1 END AS has_opoq
  FROM dbo.dx_ams_t_replacement_request r
  INNER JOIN dbo.dx_ams_m_device d ON d.device_id = r.device_id
  LEFT JOIN dbo.master_line l ON LTRIM(RTRIM(l.line_code)) = r.line_code
  LEFT JOIN dbo.dx_ams_m_device_opoq o ON o.device_id = r.device_id
`;

const rollback = async (tx) => {
  try {
    await tx.rollback();
  } catch {
    
  }
};

const insertHistory = (tx, h) =>
  new sql.Request(tx)
    .input("request_id", sql.Int, h.requestId ?? null)
    .input("device_id", sql.Int, h.deviceId)
    .input("action_type", sql.VarChar(20), h.actionType)
    .input("description", sql.VarChar(500), (h.description || "").slice(0, 500))
    .input("quantity", sql.Int, h.quantity ?? null)
    .input("stock_before", sql.Int, h.stockBefore ?? null)
    .input("stock_after", sql.Int, h.stockAfter ?? null)
    .input("action_by", sql.VarChar(50), h.actionBy)
    .query(`
      INSERT INTO dbo.dx_ams_t_asset_history
        (request_id, device_id, action_type, description, quantity, stock_before, stock_after, action_by)
      VALUES
        (@request_id, @device_id, @action_type, @description, @quantity, @stock_before, @stock_after, @action_by)
    `);

// Ambil & kunci pengajuan agar tidak diproses dua kali bersamaan
const lockRequest = async (tx, id) => {
  const result = await new sql.Request(tx)
    .input("id", sql.Int, id)
    .query(`
      SELECT r.request_id, r.device_id, r.quantity, r.status, r.requested_by, d.device_name
      FROM dbo.dx_ams_t_replacement_request r WITH (UPDLOCK, ROWLOCK)
      INNER JOIN dbo.dx_ams_m_device d ON d.device_id = r.device_id
      WHERE r.request_id = @id
    `);

  const row = result.recordset[0];
  if (!row) throw new NotFoundError("Pengajuan tidak ditemukan");
  if (row.status !== "PENDING") {
    throw new ValidationError("Pengajuan ini sudah diproses sebelumnya");
  }
  return row;
};

const setStatus = (tx, { id, status, username, note }) =>
  new sql.Request(tx)
    .input("id", sql.Int, id)
    .input("status", sql.VarChar(20), status)
    .input("username", sql.VarChar(50), username)
    .input("note", sql.VarChar(500), note || null)
    .query(`
      UPDATE dbo.dx_ams_t_replacement_request
      SET status = @status, reviewed_by = @username, review_date = GETDATE(), review_note = @note
      WHERE request_id = @id
    `);

// ============================================
// GET
// ============================================

export const getReplacementOptionsService = async () => {
  const pool = await getPool();

  const devices = await pool.request().query(`
    SELECT device_id, device_name
    FROM dbo.dx_ams_m_device
    WHERE active_flag = 1
    ORDER BY device_name
  `);

  const lines = await pool.request().query(`
    SELECT LTRIM(RTRIM(line_code)) AS line_code, LTRIM(RTRIM(line_name)) AS line_name
    FROM dbo.master_line
    WHERE LTRIM(RTRIM(flag)) = 'A'
    ORDER BY line_name
  `);

  return { devices: devices.recordset, lines: lines.recordset };
};

export const getReplacementsService = async ({ username, isAdmin }) => {
  const pool = await getPool();
  const request = pool.request();
  let where = "";

  if (!isAdmin) {
    request.input("username", sql.VarChar(50), username);
    where = "WHERE r.requested_by = @username";
  }

  const result = await request.query(`
    ${SELECT_REQUESTS}
    ${where}
    ORDER BY CASE WHEN r.status = 'PENDING' THEN 0 ELSE 1 END, r.request_date DESC
  `);

  return result.recordset;
};

export const getAssetHistoryService = async ({ username, isAdmin }) => {
  const pool = await getPool();
  const request = pool.request();
  let where = "";

  if (!isAdmin) {
    request.input("username", sql.VarChar(50), username);
    where = "WHERE r.requested_by = @username";
  }

  const result = await request.query(`
    SELECT
      h.history_id, h.request_id, h.device_id, d.device_name,
      h.action_type, h.description, h.quantity, h.stock_before, h.stock_after,
      h.action_by, ${fmtDate("h.action_date", "action_date")},
      r.requested_by
    FROM dbo.dx_ams_t_asset_history h
    INNER JOIN dbo.dx_ams_m_device d ON d.device_id = h.device_id
    LEFT JOIN dbo.dx_ams_t_replacement_request r ON r.request_id = h.request_id
    ${where}
    ORDER BY h.action_date DESC, h.history_id DESC
  `);

  return result.recordset;
};

// ============================================
// CREATE (user / admin)
// ============================================

export const createReplacementService = async ({ data, username }) => {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    const device = await new sql.Request(tx)
      .input("device_id", sql.Int, data.device_id)
      .query("SELECT device_name FROM dbo.dx_ams_m_device WHERE device_id = @device_id AND active_flag = 1");

    if (!device.recordset.length) {
      throw new ValidationError("Device tidak ditemukan atau tidak aktif");
    }

    const lineCode = data.line_code || null;
    if (lineCode) {
      const line = await new sql.Request(tx)
        .input("line_code", sql.VarChar(10), lineCode)
        .query("SELECT 1 FROM dbo.master_line WHERE LTRIM(RTRIM(line_code)) = @line_code");
      if (!line.recordset.length) throw new ValidationError("Line tidak ditemukan");
    }

    const inserted = await new sql.Request(tx)
      .input("device_id", sql.Int, data.device_id)
      .input("line_code", sql.VarChar(10), lineCode)
      .input("old_asset_info", sql.VarChar(100), data.old_asset_info || null)
      .input("quantity", sql.Int, data.quantity)
      .input("reason", sql.VarChar(500), data.reason)
      .input("username", sql.VarChar(50), username)
      .query(`
        INSERT INTO dbo.dx_ams_t_replacement_request
          (device_id, line_code, old_asset_info, quantity, reason, requested_by)
        OUTPUT INSERTED.request_id
        VALUES (@device_id, @line_code, @old_asset_info, @quantity, @reason, @username)
      `);

    const requestId = inserted.recordset[0].request_id;
    const deviceName = device.recordset[0].device_name;

    await insertHistory(tx, {
      requestId,
      deviceId: data.device_id,
      actionType: "REQUEST",
      description: `Pengajuan #${requestId}: ganti ${data.quantity} unit ${deviceName}${lineCode ? ` (Line ${lineCode})` : ""}. Alasan: ${data.reason}`,
      quantity: data.quantity,
      actionBy: username,
    });

    await tx.commit();
    return { request_id: requestId };
  } catch (error) {
    await rollback(tx);
    throw error;
  }
};

// ============================================
// APPROVE (admin) -> stok OPOQ berkurang
// ============================================

export const approveReplacementService = async ({ id, note, username }) => {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    const row = await lockRequest(tx, id);

    const stockResult = await new sql.Request(tx)
      .input("device_id", sql.Int, row.device_id)
      .query(`
        SELECT current_stock FROM dbo.dx_ams_m_device_opoq WITH (UPDLOCK, ROWLOCK)
        WHERE device_id = @device_id
      `);

    if (!stockResult.recordset.length) {
      throw new ValidationError(`Stok ${row.device_name} belum diatur di halaman OPOQ`);
    }

    const stockBefore = Number(stockResult.recordset[0].current_stock) || 0;
    if (stockBefore < row.quantity) {
      throw new ValidationError(
        `Stok ${row.device_name} tidak cukup (tersedia ${stockBefore}, diminta ${row.quantity})`
      );
    }
    const stockAfter = stockBefore - row.quantity;

    await new sql.Request(tx)
      .input("device_id", sql.Int, row.device_id)
      .input("stock", sql.Int, stockAfter)
      .input("username", sql.VarChar(50), username)
      .query(`
        UPDATE dbo.dx_ams_m_device_opoq
        SET current_stock = @stock, update_by = @username, update_date = GETDATE()
        WHERE device_id = @device_id
      `);

    await setStatus(tx, { id, status: "APPROVED", username, note });

    await insertHistory(tx, {
      requestId: id,
      deviceId: row.device_id,
      actionType: "APPROVE",
      description: `Pengajuan #${id} disetujui${note ? `. Catatan: ${note}` : ""}`,
      quantity: row.quantity,
      stockBefore,
      stockAfter,
      actionBy: username,
    });

    await tx.commit();
    return { request_id: id, stock_before: stockBefore, stock_after: stockAfter };
  } catch (error) {
    await rollback(tx);
    throw error;
  }
};

// ============================================
// REJECT (admin)
// ============================================

export const rejectReplacementService = async ({ id, note, username }) => {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    const row = await lockRequest(tx, id);

    await setStatus(tx, { id, status: "REJECTED", username, note });

    await insertHistory(tx, {
      requestId: id,
      deviceId: row.device_id,
      actionType: "REJECT",
      description: `Pengajuan #${id} ditolak. Alasan: ${note}`,
      quantity: row.quantity,
      actionBy: username,
    });

    await tx.commit();
    return { request_id: id };
  } catch (error) {
    await rollback(tx);
    throw error;
  }
};

// ============================================
// CANCEL (pemilik pengajuan / admin)
// ============================================

export const cancelReplacementService = async ({ id, username, isAdmin }) => {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    const row = await lockRequest(tx, id);

    if (!isAdmin && String(row.requested_by).trim() !== username) {
      throw new NotFoundError("Pengajuan tidak ditemukan");
    }

    await setStatus(tx, { id, status: "CANCELLED", username, note: null });

    await insertHistory(tx, {
      requestId: id,
      deviceId: row.device_id,
      actionType: "CANCEL",
      description: `Pengajuan #${id} dibatalkan`,
      quantity: row.quantity,
      actionBy: username,
    });

    await tx.commit();
    return { request_id: id };
  } catch (error) {
    await rollback(tx);
    throw error;
  }
};