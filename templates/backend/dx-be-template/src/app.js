import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { NotFoundError } from "./errors/NotFoundError.js";
import { HTTP_STATUS } from "./constants/httpStatusCodes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

// ============================================
// Global Middlewares
// ============================================
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// ============================================
// Health Check & Root
// ============================================
app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    message: "Task Endpoint API is running",
  });
});

// ============================================
// Feature Routes
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// ============================================
// 404 Not Found Handler
// ============================================
app.use((req, _res, next) => {
  next(new NotFoundError(`Rute ${req.method} ${req.originalUrl} tidak ditemukan`));
});

// ============================================
// Centralized Error Handler (Harus paling akhir)
// ============================================
app.use(errorHandler);

export default app;
