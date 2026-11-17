import sql from "mssql/msnodesqlv8.js";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=LAPTOP-EPTFQEBC\\MSSQLSERVER01;Database=DX_AMS;Trusted_Connection=yes;Encrypt=yes;TrustServerCertificate=yes;"
};

let pool = null;

export const getPool = async () => {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();

    console.log("Connected to SQL Server - Database DX_AMS");
  }

  return pool;
};

export default sql;