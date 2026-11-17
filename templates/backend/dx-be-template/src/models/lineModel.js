
import { getPool } from "../config/db.js";
import sql from "../config/db.js";

// GET ALL LINES
export const findAllLines = async () => {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      line_code,
      company_code,
      plant_code,
      bu_code,
      product_code,
      area_code,
      line_name,
      line_category,
      flag,
      create_by,
      create_date,
      update_by,
      update_date
    FROM dbo.master_line
    ORDER BY line_code ASC
  `);

  return result.recordset;
};

// GET LINE BY CODE
export const findLineByCode = async (lineCode) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("line_code", sql.Char(10), lineCode)
    .query(`
      SELECT TOP 1
        line_code,
        company_code,
        plant_code,
        bu_code,
        product_code,
        area_code,
        line_name,
        line_category,
        flag,
        create_by,
        create_date,
        update_by,
        update_date
      FROM dbo.master_line
      WHERE line_code = @line_code
    `);

  return result.recordset[0] || null;
};

// FIND LINE BY NAME
export const findLineByName = async (
  lineName,
  excludeCode = null
) => {
  const pool = await getPool();

  const request = pool
    .request()
    .input("line_name", sql.Char(100), lineName);

  let query = `
    SELECT TOP 1 line_code
    FROM dbo.master_line
    WHERE LOWER(LTRIM(RTRIM(line_name))) =
          LOWER(LTRIM(RTRIM(@line_name)))
  `;

  if (excludeCode !== null) {
    request.input("exclude_code", sql.Char(10), excludeCode);
    query += ` AND line_code <> @exclude_code`;
  }

  const result = await request.query(query);

  return result.recordset[0] || null;
};

// CREATE LINE
export const insertLine = async ({
  lineCode,
  companyCode,
  plantCode,
  buCode,
  productCode,
  areaCode,
  lineName,
  lineCategory,
  flag,
  username,
}) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("line_code", sql.Char(10), lineCode)
    .input("company_code", sql.NChar(11), companyCode)
    .input("plant_code", sql.Char(5), plantCode)
    .input("bu_code", sql.Char(10), buCode)
    .input("product_code", sql.Char(8), productCode)
    .input("area_code", sql.Char(50), areaCode)
    .input("line_name", sql.Char(100), lineName)
    .input("line_category", sql.VarChar(50), lineCategory)
    .input("flag", sql.Char(1), flag)
    .input("create_by", sql.Char(10), username)
    .query(`
      INSERT INTO dbo.master_line (
        line_code,
        company_code,
        plant_code,
        bu_code,
        product_code,
        area_code,
        line_name,
        line_category,
        flag,
        create_by,
        create_date
      )
      VALUES (
        @line_code,
        @company_code,
        @plant_code,
        @bu_code,
        @product_code,
        @area_code,
        @line_name,
        @line_category,
        @flag,
        @create_by,
        GETDATE()
      )
    `);

  return await findLineByCode(lineCode);
};

// UPDATE LINE
export const updateLine = async ({
  oldLineCode,
  newLineCode,
  companyCode,
  plantCode,
  buCode,
  productCode,
  areaCode,
  lineName,
  lineCategory,
  flag,
  username,
}) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("old_line_code", sql.Char(10), oldLineCode)
    .input("new_line_code", sql.Char(10), newLineCode)
    .input("company_code", sql.NChar(11), companyCode)
    .input("plant_code", sql.Char(5), plantCode)
    .input("bu_code", sql.Char(10), buCode)
    .input("product_code", sql.Char(8), productCode)
    .input("area_code", sql.Char(50), areaCode)
    .input("line_name", sql.Char(100), lineName)
    .input("line_category", sql.VarChar(50), lineCategory)
    .input("flag", sql.Char(1), flag)
    .input("update_by", sql.Char(10), username)
    .query(`
      UPDATE dbo.master_line
      SET
        line_code = @new_line_code,
        company_code = @company_code,
        plant_code = @plant_code,
        bu_code = @bu_code,
        product_code = @product_code,
        area_code = @area_code,
        line_name = @line_name,
        line_category = @line_category,
        flag = @flag,
        update_by = @update_by,
        update_date = GETDATE()
      WHERE line_code = @old_line_code;

      SELECT @@ROWCOUNT AS affected_rows;
    `);

  return result.recordset[0].affected_rows > 0;
};

// DELETE LINE
export const deleteLine = async (lineCode) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("line_code", sql.Char(10), lineCode)
    .query(`
      DELETE FROM dbo.master_line
      WHERE line_code = @line_code;

      SELECT @@ROWCOUNT AS affected_rows;
    `);

  return result.recordset[0].affected_rows > 0;
};
