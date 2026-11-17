import { getPool } from "../config/db.js";
import sql from "../config/db.js";

// CONVERT DATE STRING TO SQL DATE
const toSqlDate = (value) => {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day);
};

// GET ALL SPECS
export const findAllSpecs = async () => {
    const pool = await getPool();

    const result = await pool.request().query(`
    SELECT
      spec_id,
      spec_name,
      lifetime_start,
      lifetime_end,
      active_flag,
      create_by,
      create_date,
      update_by,
      update_date
    FROM dbo.dx_ams_m_spec
    ORDER BY spec_id ASC
  `);

    return result.recordset;
};

// GET SPEC BY ID
export const findSpecById = async (specId) => {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("spec_id", sql.Int, specId)
        .query(`
      SELECT TOP 1
        spec_id,
        spec_name,
        lifetime_start,
        lifetime_end,
        active_flag,
        create_by,
        create_date,
        update_by,
        update_date
      FROM dbo.dx_ams_m_spec
      WHERE spec_id = @spec_id
    `);

    return result.recordset[0] || null;
};

// FIND SPEC BY NAME
export const findSpecByName = async (
    specName,
    excludeId = null
) => {
    const pool = await getPool();

    const request = pool.request()
        .input("spec_name", sql.VarChar(sql.MAX), specName);

    let query = `
    SELECT TOP 1 spec_id
    FROM dbo.dx_ams_m_spec
    WHERE LOWER(LTRIM(RTRIM(spec_name))) =
          LOWER(LTRIM(RTRIM(@spec_name)))
  `;

    if (excludeId !== null) {
        request.input("exclude_id", sql.Int, excludeId);
        query += ` AND spec_id <> @exclude_id`;
    }

    const result = await request.query(query);

    return result.recordset[0] || null;
};

// CREATE SPEC
export const insertSpec = async ({
    specName,
    lifetimeStart,
    lifetimeEnd,
    activeFlag,
    username,
}) => {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("spec_name", sql.VarChar(sql.MAX), specName)
        .input("lifetime_start", sql.Date, toSqlDate(lifetimeStart))
        .input("lifetime_end", sql.Date, toSqlDate(lifetimeEnd))
        .input("active_flag", sql.Int, activeFlag)
        .input("create_by", sql.VarChar(sql.MAX), username)
        .query(`
      INSERT INTO dbo.dx_ams_m_spec (
        spec_name,
        lifetime_start,
        lifetime_end,
        active_flag,
        create_by,
        create_date
      )
      OUTPUT INSERTED.spec_id
      VALUES (
        @spec_name,
        @lifetime_start,
        @lifetime_end,
        @active_flag,
        @create_by,
        GETDATE()
      )
    `);

    const specId = result.recordset[0].spec_id;

    return await findSpecById(specId);
};

// UPDATE SPEC
export const updateSpec = async ({
    specId,
    specName,
    lifetimeStart,
    lifetimeEnd,
    activeFlag,
    username,
}) => {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("spec_id", sql.Int, specId)
        .input("spec_name", sql.VarChar(sql.MAX), specName)
        .input(
            "lifetime_start",
            sql.Date,
            toSqlDate(lifetimeStart)
        )
        .input(
            "lifetime_end",
            sql.Date,
            toSqlDate(lifetimeEnd)
        )
        .input("active_flag", sql.Int, activeFlag)
        .input("update_by", sql.VarChar(sql.MAX), username)
        .query(`
      UPDATE dbo.dx_ams_m_spec
      SET
        spec_name = @spec_name,
        lifetime_start = @lifetime_start,
        lifetime_end = @lifetime_end,
        active_flag = @active_flag,
        update_by = @update_by,
        update_date = GETDATE()
      WHERE spec_id = @spec_id;

      SELECT @@ROWCOUNT AS affected_rows;
    `);

    return result.recordset[0].affected_rows > 0;
};

// SOFT DELETE SPEC
export const deactivateSpec = async ({
    specId,
    username,
}) => {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("spec_id", sql.Int, specId)
        .input("update_by", sql.VarChar(sql.MAX), username)
        .query(`
      UPDATE dbo.dx_ams_m_spec
      SET
        active_flag = 0,
        update_by = @update_by,
        update_date = GETDATE()
      WHERE spec_id = @spec_id
        AND active_flag = 1;

      SELECT @@ROWCOUNT AS affected_rows;
    `);

    return result.recordset[0].affected_rows > 0;
};
