import app from "./app.js";
import { getPool } from "./config/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Verifikasi koneksi ke SQL Server
    console.log("Menghubungkan ke SQL Server...");
    await getPool();

    // 2. Jalankan HTTP server
    const server = app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Health check available on http://localhost:${PORT}/health`);
    });

    // 3. Graceful shutdown handler
    const handleShutdown = (signal) => {
      console.log(`\nMenerima ${signal}. Mematikan server secara graceful...`);
      server.close(() => {
        console.log("HTTP server ditutup.");
        process.exit(0);
      });

      // Force shutdown jika tidak selesai dalam 5 detik
      setTimeout(() => {
        console.error("Penutupan paksa server setelah timeout.");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
  console.error("Gagal memulai server:", error);
  process.exit(1);
}
};

startServer();
