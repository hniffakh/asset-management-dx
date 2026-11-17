import sql, { getPool } from "../config/db.js";

// SESUAIKAN dengan nilai current_status "tersedia" di dx_ams_t_asset (lihat langkah 4)
export const STATUS_AVAILABLE = "Available";

// REVISI 1: tanpa join stok/aset/OPOQ, hanya data device
const selectDevices = (where = "") => `
  SELECT d.device_id, d.device_name, d.active_flag,
         d.create_by, d.create_date, d.update_by, d.update_date
  FROM dx_ams_m_device d
  ${where}
  ORDER BY d.device_name`;

export const findAllDevices = async () => {
  const pool = await getPool();
  const result = await pool
    .request()
    // REVISI 2: input "available" dihapus (tidak dipakai lagi)
    .query(selectDevices());
  return result.recordset;
};

export const findDeviceById = async (deviceId) => {
  const pool = await getPool();
  const result = await pool
    .request()
    // REVISI 3: input "available" dihapus (tidak dipakai lagi)
    .input("id", sql.Int, deviceId)
    .query(selectDevices("WHERE d.device_id = @id"));
  return result.recordset[0] || null;
};

export const findDeviceByName = async (deviceName, excludeId = null) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", sql.VarChar(100), deviceName)
    .input("excludeId", sql.Int, excludeId)
    .query(`
      SELECT TOP 1 device_id
      FROM dx_ams_m_device
      WHERE LOWER(device_name) = LOWER(@name)
        AND (@excludeId IS NULL OR device_id <> @excludeId)`);
  return result.recordset[0] || null;
};

export const insertDevice = async ({ deviceName, activeFlag = 1, username }) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", sql.VarChar(100), deviceName)
    .input("flag", sql.Int, activeFlag)
    .input("user", sql.VarChar(50), username)
    .query(`
      INSERT INTO dx_ams_m_device (device_name, active_flag, create_by, create_date)
      OUTPUT INSERTED.device_id
      VALUES (@name, @flag, @user, GETDATE())`);
  return result.recordset[0].device_id;
};

export const updateDevice = async ({ deviceId, deviceName, activeFlag, username }) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, deviceId)
    .input("name", sql.VarChar(100), deviceName)
    .input("flag", sql.Int, activeFlag)
    .input("user", sql.VarChar(50), username)
    .query(`
    UPDATE dx_ams_m_device
    SET device_name = @name, active_flag = @flag,
    update_by = @user, update_date = GETDATE()
    OUTPUT INSERTED.device_id
    WHERE device_id = @id`);
  return (result.recordset?.length ?? 0) > 0;
};

export const countAssetsByDevice = async (deviceId) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, deviceId)
    .query("SELECT COUNT(*) AS total FROM dx_ams_t_asset WHERE device_id = @id");
  return result.recordset[0].total;
};

export const deactivateDevice = async ({ deviceId, username }) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, deviceId)
    .input("user", sql.VarChar(50), username)
        .query(`
      UPDATE dx_ams_m_device
      SET active_flag = 0, update_by = @user, update_date = GETDATE()
      OUTPUT INSERTED.device_id
      WHERE device_id = @id AND active_flag = 1`);
  return (result.recordset?.length ?? 0) > 0;
};

export const insertAssets = async ({ deviceId, qty, username }) => {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();
  try {
    const stamp = Date.now().toString(36).toUpperCase();
    for (let i = 1; i <= qty; i++) {
      await new sql.Request(tx)
        .input("assetId", sql.VarChar(50), `AST-${deviceId}-${stamp}-${i}`)
        .input("deviceId", sql.Int, deviceId)
        .input("status", sql.VarChar(50), STATUS_AVAILABLE)
        .input("user", sql.VarChar(50), username)
        .query(`
          INSERT INTO dx_ams_t_asset
            (asset_id, device_id, current_status, create_by, create_date)
          VALUES (@assetId, @deviceId, @status, @user, GETDATE())`);
    }
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
};