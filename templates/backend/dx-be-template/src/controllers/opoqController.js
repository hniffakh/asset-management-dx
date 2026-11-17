import sql, { getPool } from "../config/db.js";

const toInt = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

// GET /api/opoq
export const getOpoq = async (_req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT * FROM dbo.vw_dx_ams_opoq_status
      ORDER BY status_priority, device_name
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    next(err);
  }
};

// PUT /api/opoq/:deviceId  -> tambah kalau belum ada, ubah kalau sudah ada
export const upsertOpoq = async (req, res, next) => {
  const deviceId = toInt(req.params.deviceId);
  const stock = toInt(req.body.current_stock);
  const op = toInt(req.body.order_point);
  const oq = toInt(req.body.order_qty);
  const forceUrgent = req.body.force_urgent ? 1 : 0;
  const remarks = req.body.remarks ? String(req.body.remarks).slice(0, 500) : null;
  const user = req.user?.username || req.body.user || "system";

  if (deviceId === null || stock === null || op === null || oq === null) {
    return res.status(400).json({
      success: false,
      message: "Stok, Order Point, dan Order Quantity harus angka bulat 0 atau lebih",
    });
  }

  try {
    const pool = await getPool();

    const device = await pool.request()
      .input("device_id", sql.Int, deviceId)
      .query("SELECT 1 FROM dbo.dx_ams_m_device WHERE device_id = @device_id");

    if (device.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Device tidak ditemukan" });
    }

    await pool.request()
      .input("device_id", sql.Int, deviceId)
      .input("current_stock", sql.Int, stock)
      .input("order_point", sql.Int, op)
      .input("order_qty", sql.Int, oq)
      .input("force_urgent", sql.Bit, forceUrgent)
      .input("remarks", sql.VarChar(500), remarks)
      .input("user", sql.VarChar(50), user)
      .query(`
        IF EXISTS (SELECT 1 FROM dbo.dx_ams_m_device_opoq WHERE device_id = @device_id)
          UPDATE dbo.dx_ams_m_device_opoq
          SET current_stock = @current_stock,
              order_point   = @order_point,
              order_qty     = @order_qty,
              force_urgent  = @force_urgent,
              remarks       = @remarks,
              update_by     = @user,
              update_date   = GETDATE()
          WHERE device_id = @device_id;
        ELSE
          INSERT INTO dbo.dx_ams_m_device_opoq
            (device_id, current_stock, order_point, order_qty, force_urgent, remarks, create_by, create_date)
          VALUES
            (@device_id, @current_stock, @order_point, @order_qty, @force_urgent, @remarks, @user, GETDATE());
      `);

    res.json({ success: true, message: "Data OPOQ berhasil disimpan" });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/opoq/:deviceId  -> reset, device kembali "Belum Diatur"
export const resetOpoq = async (req, res, next) => {
  const deviceId = toInt(req.params.deviceId);
  if (deviceId === null) {
    return res.status(400).json({ success: false, message: "Device ID tidak valid" });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input("device_id", sql.Int, deviceId)
      .query("DELETE FROM dbo.dx_ams_m_device_opoq WHERE device_id = @device_id");

    res.json({ success: true, message: "Data OPOQ berhasil direset" });
  } catch (err) {
    next(err);
  }
};