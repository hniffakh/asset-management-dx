import sql, { getPool } from "../config/db.js";

const COLS = `opoq_item_id, item_name, current_stock, order_point, order_qty,
  create_by, create_date, update_by, update_date`;

export const findAllOpoq = async () => {
  const pool = await getPool();
  const r = await pool.request().query(
    `SELECT ${COLS} FROM dbo.dx_ams_m_opoq_item ORDER BY opoq_item_id ASC`
  );
  return r.recordset;
};

export const findOpoqById = async (id) => {
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, id).query(
    `SELECT TOP 1 ${COLS} FROM dbo.dx_ams_m_opoq_item WHERE opoq_item_id = @id`
  );
  return r.recordset[0] || null;
};

export const findOpoqByName = async (name, excludeId = null) => {
  const pool = await getPool();
  const r = await pool.request()
    .input("name", sql.VarChar(100), name)
    .input("ex", sql.Int, excludeId)
    .query(`SELECT TOP 1 opoq_item_id FROM dbo.dx_ams_m_opoq_item
            WHERE LOWER(LTRIM(RTRIM(item_name))) = LOWER(LTRIM(RTRIM(@name)))
              AND (@ex IS NULL OR opoq_item_id <> @ex)`);
  return r.recordset[0] || null;
};

export const insertOpoq = async ({ itemName, currentStock, orderPoint, orderQty, username }) => {
  const pool = await getPool();
  const r = await pool.request()
    .input("name", sql.VarChar(100), itemName)
    .input("stock", sql.Int, currentStock)
    .input("op", sql.Int, orderPoint)
    .input("oq", sql.Int, orderQty)
    .input("user", sql.VarChar(50), username)
    .query(`INSERT INTO dbo.dx_ams_m_opoq_item
              (item_name, current_stock, order_point, order_qty, create_by, create_date)
            OUTPUT INSERTED.opoq_item_id
            VALUES (@name, @stock, @op, @oq, @user, GETDATE())`);
  return r.recordset[0].opoq_item_id;
};

export const updateOpoq = async ({ id, itemName, currentStock, orderPoint, orderQty, username }) => {
  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("name", sql.VarChar(100), itemName)
    .input("stock", sql.Int, currentStock)
    .input("op", sql.Int, orderPoint)
    .input("oq", sql.Int, orderQty)
    .input("user", sql.VarChar(50), username)
    .query(`UPDATE dbo.dx_ams_m_opoq_item
            SET item_name=@name, current_stock=@stock, order_point=@op,
                order_qty=@oq, update_by=@user, update_date=GETDATE()
            WHERE opoq_item_id=@id`);
  return r.rowsAffected[0] > 0;
};

export const removeOpoq = async (id) => {
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, id)
    .query(`DELETE FROM dbo.dx_ams_m_opoq_item WHERE opoq_item_id=@id`);
  return r.rowsAffected[0] > 0;
};