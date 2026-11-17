import { findAllDevices, findDeviceById, findDeviceByName, insertDevice, updateDevice, countAssetsByDevice, deactivateDevice, insertAssets} from "../models/deviceModel.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { AppError } from "../errors/AppError.js";

const validateId = (deviceId) => {
  const id = Number(deviceId);
  if (!Number.isInteger(id) || id <= 0) throw new ValidationError("Device ID tidak valid");
  return id;
};

const validateName = (deviceName) => {
  if (typeof deviceName !== "string" || !deviceName.trim()) {
    throw new ValidationError("Nama device wajib diisi");
  }
  return deviceName.trim();
};

const validateActiveFlag = (activeFlag) => {
  if (activeFlag !== 0 && activeFlag !== 1) {
    throw new ValidationError("Status device hanya boleh 0 (Inactive) atau 1 (Active)");
  }
  return activeFlag;
};

const requireUser = (username) => {
  if (!username) throw new AppError("Informasi user tidak ditemukan", 401);
};

export const getAllDevicesService = async () => findAllDevices();

export const getDeviceByIdService = async (deviceId) => {
  const device = await findDeviceById(validateId(deviceId));
  if (!device) throw new NotFoundError("Device tidak ditemukan");
  return device;
};

export const createDeviceService = async ({ deviceName, activeFlag = 1, username }) => {
  const name = validateName(deviceName);
  const status = validateActiveFlag(activeFlag);
  requireUser(username);

  if (await findDeviceByName(name)) {
    throw new AppError("Nama device sudah terdaftar", 409);
  }

  const newId = await insertDevice({ deviceName: name, activeFlag: status, username });
  return findDeviceById(newId);
};

export const updateDeviceService = async ({ deviceId, deviceName, activeFlag, username }) => {
  const id = validateId(deviceId);
  const name = validateName(deviceName);
  const status = validateActiveFlag(activeFlag);
  requireUser(username);

  if (!(await findDeviceById(id))) throw new NotFoundError("Device tidak ditemukan");

  if (await findDeviceByName(name, id)) {
    throw new AppError("Nama device sudah digunakan oleh device lain", 409);
  }

  const updated = await updateDevice({ deviceId: id, deviceName: name, activeFlag: status, username });
  if (!updated) throw new NotFoundError("Device gagal diperbarui");

  return findDeviceById(id);
};

export const deleteDeviceService = async ({ deviceId, username }) => {
  const id = validateId(deviceId);
  requireUser(username);

  const device = await findDeviceById(id);
  if (!device) throw new NotFoundError("Device tidak ditemukan");

  if (Number(device.active_flag) === 0) {
    throw new AppError("Device sudah berstatus Inactive", 409);
  }

  const deleted = await deactivateDevice({ deviceId: id, username });
  if (!deleted) throw new AppError("Device gagal dinonaktifkan", 409);

  return { device_id: id, device_name: device.device_name, active_flag: 0 };
};

export const addStockService = async ({ deviceId, qty, username }) => {
  const id = validateId(deviceId);
  requireUser(username);

  const amount = Number(qty);
  if (!Number.isInteger(amount) || amount < 1 || amount > 500) {
    throw new ValidationError("Jumlah unit harus 1 sampai 500");
  }

  if (!(await findDeviceById(id))) throw new NotFoundError("Device tidak ditemukan");

  await insertAssets({ deviceId: id, qty: amount, username });
  return findDeviceById(id);
};