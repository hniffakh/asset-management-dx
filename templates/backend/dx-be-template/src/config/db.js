import sql from "mssql/msnodesqlv8.js";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=DX_AMS;Trusted_Connection=yes;Encrypt=yes;TrustServerCertificate=yes;"
};

// const dbConfig = {
//   server: ".",
//   database: "DX_AMS",
//   driver: "msnodesqlv8",
//   options: {
//     trustedConnection: true,
//     trustServerCertificate: true, // Sesuai centang "Trust Server Certificate" di gambar
//     encrypt: true, // Sesuai opsi "Mandatory" di gambar
//   },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
// };

let pool = null;

export const getPool = async () => {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();

    console.log(
      `Connected to SQL Server - Database ${dbConfig.database}`
    );
  }

  return pool;
};

export default sql;