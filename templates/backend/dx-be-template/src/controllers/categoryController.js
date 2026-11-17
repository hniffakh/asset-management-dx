import { getAllCategoriesService, getCategoryByIdService, createCategoryService, updateCategoryService} from "../services/categoryService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// GET ALL CATEGORIES
export const getAllCategories = async (req, res, next) => {
  try {
    const result = await getAllCategoriesService();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getCategoryByIdService(id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Detail kategori berhasil diambil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE CATEGORY
export const createCategory = async (req, res, next) => {
  try {
    const { category_name, active_flag = 1 } = req.validated;

    const result = await createCategoryService({
      categoryName: category_name,
      activeFlag: active_flag,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_name, active_flag } = req.validated;

    const result = await updateCategoryService({
      categoryId: id,
      categoryName: category_name,
      activeFlag: active_flag,
      username: req.user.username,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

