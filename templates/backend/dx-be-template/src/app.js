import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { NotFoundError } from "./errors/NotFoundError.js";
import { HTTP_STATUS } from "./constants/httpStatusCodes.js";
import { authenticate } from "./middleware/authenticate.js";
import { adminForWrites } from "./middleware/authorize.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import lineRoutes from "./routes/lineRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import specRoutes from "./routes/specRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import opoqRoutes from "./routes/opoqRoutes.js";
import replacementRoutes from "./routes/replacementRoutes.js";
import assetHistoryRoutes from "./routes/assetHistoryRoutes.js";

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Health Check & Root API
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

// Feature Routes
app.use("/api/auth", authRoutes);

// Master
app.use("/api/categories", authenticate, adminForWrites, categoryRoutes);
app.use("/api/lines", authenticate, adminForWrites, lineRoutes);
app.use("/api/suppliers", authenticate, adminForWrites, supplierRoutes);
app.use("/api/specs", authenticate, adminForWrites, specRoutes);
app.use("/api/devices", authenticate, adminForWrites, deviceRoutes);
app.use("/api/opoq", authenticate, adminForWrites, opoqRoutes);

// Peminjaman Aset 
app.use("/api/replacement-requests", replacementRoutes);
app.use("/api/asset-history", assetHistoryRoutes);

// 404 Not Found Handler
app.use((req, _res, next) => {
  next(new NotFoundError(`Rute ${req.method} ${req.originalUrl} tidak ditemukan`));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;