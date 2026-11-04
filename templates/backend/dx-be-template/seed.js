import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { getPool } from "./src/config/db.js";
import sql from "./src/config/db.js";

dotenv.config();

const seedUser = async () => {
  try {
    const pool = await getPool();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("password123", saltRounds);

    // Buat tabel users jika belum ada
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      BEGIN
        CREATE TABLE users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          username NVARCHAR(50) NOT NULL UNIQUE,
          password NVARCHAR(255) NOT NULL,
          email NVARCHAR(100) NOT NULL,
          created_at DATETIME DEFAULT GETDATE()
        );
      END
    `);

    const checkResult = await pool
      .request()
      .input("username", sql.NVarChar, "user123")
      .query("SELECT id FROM users WHERE username = @username");

    if (checkResult.recordset.length > 0) {
      console.log("User 'user123' sudah ada, seed dilewati.");
      process.exit(0);
    }

    await pool
      .request()
      .input("username", sql.NVarChar, "user123")
      .input("password", sql.NVarChar, hashedPassword)
      .input("email", sql.NVarChar, "user@example.com")
      .query(
        "INSERT INTO users (username, password, email) VALUES (@username, @password, @email)"
      );

    console.log(" Seed berhasil!");
    console.log("   Username : user123");
    console.log("   Password : password123");
    process.exit(0);
  } catch (err) {
    console.error(" Seed gagal:", err.message);
    process.exit(1);
  }
};

seedUser();
