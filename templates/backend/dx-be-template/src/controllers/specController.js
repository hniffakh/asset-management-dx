import { getAllSpecsService, getSpecByIdService, createSpecService, updateSpecService, deleteSpecService} from "../services/specService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// GET ALL SPECS
export const getAllSpecs = async (req, res, next) => {
  try {
    const result = await getAllSpecsService();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Data spesifikasi berhasil diambil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET SPEC BY ID
export const getSpecById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getSpecByIdService(id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Detail spesifikasi berhasil diambil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE SPEC
export const createSpec = async (req, res, next) => {
  try {
    const {
      spec_name,
      lifetime_start,
      lifetime_end,
      active_flag = 1,
    } = req.validated;

    const result = await createSpecService({
      specName: spec_name,
      lifetimeStart: lifetime_start,
      lifetimeEnd: lifetime_end,
      activeFlag: active_flag,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Spesifikasi berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE SPEC
export const updateSpec = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      spec_name,
      lifetime_start,
      lifetime_end,
      active_flag,
    } = req.validated;

    const result = await updateSpecService({
      specId: id,
      specName: spec_name,
      lifetimeStart : lifetime_start,
      lifetimeEnd : lifetime_end,
      activeFlag: active_flag,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Spesifikasi berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SPEC (SOFT DELETE)
export const deleteSpec = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteSpecService({
      specId: id,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Spesifikasi berhasil dinonaktifkan",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
