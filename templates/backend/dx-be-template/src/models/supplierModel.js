import { getPool } from "../config/db.js";
import sql from "../config/db.js";

// GET ALL SUPPLIER
export const findAllSupplier = async () => {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      supplier_id,
      supplier_by,
      CONVERT(VARCHAR(10), supplier_date, 23) AS supplier_date,
      price_supplier,
      create_by,
      create_date,
      update_by,
      update_date
    FROM dbo.dx_ams_m_supplier
    ORDER BY supplier_id ASC
  `);

  return result.recordset;
};

// GET SUPPLIER BY ID
export const findSupplierById = async (supplierId) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("supplier_id", sql.Int, supplierId)
    .query(`
      SELECT TOP 1
        supplier_id,
        supplier_by,
        CONVERT(VARCHAR(10), supplier_date, 23) AS supplier_date,
        price_supplier,
        create_by,
        create_date,
        update_by,
        update_date
      FROM dbo.dx_ams_m_supplier
      WHERE supplier_id = @supplier_id
    `);

  return result.recordset[0] || null;
};

// FIND SUPPLIER BY NAME
export const findSupplierByName = async (
  supplierBy,
  excludeId = null
) => {
  const pool = await getPool();

  const request = pool
    .request()
    .input("supplier_by", sql.VarChar(sql.MAX), supplierBy);

  let query = `
    SELECT TOP 1 supplier_id
    FROM dbo.dx_ams_m_supplier
    WHERE LOWER(LTRIM(RTRIM(supplier_by))) =
          LOWER(LTRIM(RTRIM(@supplier_by)))
  `;

  if (excludeId !== null) {
    request.input("exclude_id", sql.Int, excludeId);
    query += ` AND supplier_id <> @exclude_id`;
  }

  const result = await request.query(query);

  return result.recordset[0] || null;
};

// CREATE SUPPLIER
export const insertSupplier = async ({
  supplierBy,
  supplierDate,
  priceSupplier,
  username,
}) => {
  const pool = await getPool();

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

    const request = new sql.Request(transaction);

    // Generate ID secara manual dengan locking
    const idResult = await request.query(`
      SELECT ISNULL(MAX(supplier_id), 0) + 1 AS next_id
      FROM dbo.dx_ams_m_supplier WITH (TABLOCKX, HOLDLOCK)
    `);

    const supplierId = idResult.recordset[0].next_id;

    const insertRequest = new sql.Request(transaction);

    insertRequest
      .input("supplier_id", sql.Int, supplierId)
      .input("supplier_by", sql.VarChar(sql.MAX), supplierBy)
      .input("supplier_date", sql.VarChar(10), supplierDate)
      .input("price_supplier", sql.Decimal(18, 2), Number(priceSupplier))
      .input("create_by", sql.VarChar(sql.MAX), username);

    await insertRequest.query(`
      INSERT INTO dbo.dx_ams_m_supplier (
        supplier_id,
        supplier_by,
        supplier_date,
        price_supplier,
        create_by,
        create_date
      )
      VALUES (
        @supplier_id,
        @supplier_by,
        CONVERT(DATE, @supplier_date, 23),
        @price_supplier,
        @create_by,
        GETDATE()
      )
    `);

    await transaction.commit();

    return await findSupplierById(supplierId);

  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      
    }

    throw error;
  }
};

// UPDATE SUPPLIER
export const updateSupplier = async ({
  supplierId,
  supplierBy,
  supplierDate,
  priceSupplier,
  username,
}) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("supplier_id", sql.Int, supplierId)
    .input("supplier_by", sql.VarChar(sql.MAX), supplierBy)
    .input("supplier_date", sql.VarChar(10), supplierDate)
    .input("price_supplier", sql.Decimal(18, 2), Number(priceSupplier))
    .input("update_by", sql.VarChar(sql.MAX), username)
    .query(`
      UPDATE dbo.dx_ams_m_supplier
      SET
        supplier_id = @supplier_id,
        supplier_by = @supplier_by,
        supplier_date = CONVERT(DATE, @supplier_date, 23),
        price_supplier = @price_supplier,
        update_by = @update_by,
        update_date = GETDATE()
      WHERE supplier_id = @supplier_id;

      SELECT @@ROWCOUNT AS affected_rows;
    `);

  return result.recordset[0].affected_rows > 0;
};

// DELETE SUPPLIER
export const deleteSupplier = async (supplierId) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("supplier_id", sql.Int, supplierId)
    .query(`
      DELETE FROM dbo.dx_ams_m_supplier
      WHERE supplier_id = @supplier_id;

      SELECT @@ROWCOUNT AS affected_rows;
    `);

  return result.recordset[0].affected_rows > 0;
};