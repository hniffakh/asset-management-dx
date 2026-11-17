import { getPool } from "../config/db.js";
import sql from "../config/db.js";

export const findUserByUsername = async (username) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .query(`
      SELECT TOP 1
        npk,
        username,
        role,
        password,
        department
      FROM dbo.dx_ams_m_user
      WHERE username = @username
    `);

  return result.recordset[0] || null;
};

export const findUserById = async (id) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("npk", sql.Int, id)
    .query(`
      SELECT TOP 1
        npk,
        username,
        password
      FROM dbo.dx_ams_m_user
      WHERE npk = @npk
    `);

  return result.recordset[0] || null;
};
