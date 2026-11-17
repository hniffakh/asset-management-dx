import { getAllDevicesService, getDeviceByIdService, createDeviceService, updateDeviceService, deleteDeviceService, addStockService} from "../services/deviceService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const getAllDevices = async (req, res, next) => {
  try {
    const data = await getAllDevicesService();
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Data device berhasil diambil", data });
  } catch (error) { next(error); }
};

export const getDeviceById = async (req, res, next) => {
  try {
    const data = await getDeviceByIdService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Detail device berhasil diambil", data });
  } catch (error) { next(error); }
};

export const createDevice = async (req, res, next) => {
  try {
    const data = await createDeviceService({
      deviceName: req.validated.device_name,
      activeFlag: req.validated.active_flag, // REVISI 1: baris baru
      username: req.user.username,
    });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Device berhasil ditambahkan", data });
  } catch (error) { next(error); }
};

export const updateDevice = async (req, res, next) => {
  try {
    const data = await updateDeviceService({
      deviceId: req.params.id,
      deviceName: req.validated.device_name,
      activeFlag: req.validated.active_flag, // REVISI 2: baris baru
      username: req.user.username,
    });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Device berhasil diperbarui", data });
  } catch (error) { next(error); }
};

export const deleteDevice = async (req, res, next) => {
  try {
    const data = await deleteDeviceService({
      deviceId: req.params.id,
      username: req.user.username,
    });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Device berhasil dihapus", data });
  } catch (error) { next(error); }
};

export const addStock = async (req, res, next) => {
  try {
    const data = await addStockService({
      deviceId: req.params.id,
      qty: req.validated.qty,
      username: req.user.username,
    });
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Stok berhasil ditambahkan", data });
  } catch (error) { next(error); }
};

