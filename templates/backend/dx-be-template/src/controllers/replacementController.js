import {
  getReplacementOptionsService,
  getReplacementsService,
  getAssetHistoryService,
  createReplacementService,
  approveReplacementService,
  rejectReplacementService,
  cancelReplacementService,
} from "../services/replacementService.js";
import { ValidationError } from "../errors/ValidationError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

const isAdmin = (req) => String(req.user?.role || "").trim().toLowerCase() === "admin";

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("ID pengajuan tidak valid");
  }
  return id;
};

const ok = (res, message, data) =>
  res.status(HTTP_STATUS.OK).json({ success: true, message, data });

export const getReplacementOptions = async (_req, res, next) => {
  try {
    ok(res, "Data pilihan berhasil diambil", await getReplacementOptionsService());
  } catch (error) {
    next(error);
  }
};

export const getReplacements = async (req, res, next) => {
  try {
    const data = await getReplacementsService({
      username: req.user.username,
      isAdmin: isAdmin(req),
    });
    ok(res, "Data pengajuan berhasil diambil", data);
  } catch (error) {
    next(error);
  }
};

export const getAssetHistory = async (req, res, next) => {
  try {
    const data = await getAssetHistoryService({
      username: req.user.username,
      isAdmin: isAdmin(req),
    });
    ok(res, "Riwayat aset berhasil diambil", data);
  } catch (error) {
    next(error);
  }
};

export const createReplacement = async (req, res, next) => {
  try {
    const data = await createReplacementService({
      data: req.validated,
      username: req.user.username,
    });
    ok(res, "Pengajuan berhasil dibuat", data);
  } catch (error) {
    next(error);
  }
};

export const approveReplacement = async (req, res, next) => {
  try {
    const data = await approveReplacementService({
      id: parseId(req.params.id),
      note: req.validated.review_note || null,
      username: req.user.username,
    });
    ok(res, "Pengajuan berhasil disetujui", data);
  } catch (error) {
    next(error);
  }
};

export const rejectReplacement = async (req, res, next) => {
  try {
    const data = await rejectReplacementService({
      id: parseId(req.params.id),
      note: req.validated.review_note,
      username: req.user.username,
    });
    ok(res, "Pengajuan berhasil ditolak", data);
  } catch (error) {
    next(error);
  }
};

export const cancelReplacement = async (req, res, next) => {
  try {
    const data = await cancelReplacementService({
      id: parseId(req.params.id),
      username: req.user.username,
      isAdmin: isAdmin(req),
    });
    ok(res, "Pengajuan berhasil dibatalkan", data);
  } catch (error) {
    next(error);
  }
};