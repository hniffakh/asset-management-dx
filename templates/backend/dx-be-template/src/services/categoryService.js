
import {
  findAllCategories,
  findCategoryById,
  findCategoryByName,
  insertCategory,
  updateCategory,
  deactivateCategory,
} from "../models/categoryModel.js";

import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { AppError } from "../errors/AppError.js";

// ============================================
// HELPER: VALIDATE CATEGORY ID
// ============================================
const validateCategoryId = (categoryId) => {
  const id = Number(categoryId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("Category ID tidak valid");
  }

  return id;
};

// ============================================
// HELPER: VALIDATE CATEGORY NAME
// ============================================
const validateCategoryName = (categoryName) => {
  if (
    typeof categoryName !== "string" ||
    !categoryName.trim()
  ) {
    throw new ValidationError("Nama kategori wajib diisi");
  }

  return categoryName.trim();
};

// ============================================
// HELPER: VALIDATE ACTIVE FLAG
// ============================================
const validateActiveFlag = (activeFlag) => {
  if (
    activeFlag !== 0 &&
    activeFlag !== 1
  ) {
    throw new ValidationError(
      "Status kategori hanya boleh 0 (Inactive) atau 1 (Active)"
    );
  }

  return activeFlag;
};

// ============================================
// GET ALL CATEGORIES
// ============================================
export const getAllCategoriesService = async () => {
  return await findAllCategories();
};

// ============================================
// GET CATEGORY BY ID
// ============================================
export const getCategoryByIdService = async (categoryId) => {
  const id = validateCategoryId(categoryId);

  const category = await findCategoryById(id);

  if (!category) {
    throw new NotFoundError("Kategori tidak ditemukan");
  }

  return category;
};

// ============================================
// CREATE CATEGORY
// ============================================
export const createCategoryService = async ({
  categoryName,
  activeFlag = 1,
  username,
}) => {
  const name = validateCategoryName(categoryName);
  const status = validateActiveFlag(activeFlag);

  if (!username) {
    throw new AppError("Informasi user tidak ditemukan", 401);
  }

  // Cek nama kategori duplikat
  const existingCategory = await findCategoryByName(name);

  if (existingCategory) {
    throw new AppError(
      "Nama kategori sudah terdaftar",
      409
    );
  }

  const category = await insertCategory({
    categoryName: name,
    activeFlag: status,
    username,
  });

  return category;
};

// ============================================
// UPDATE CATEGORY
// ============================================
export const updateCategoryService = async ({
  categoryId,
  categoryName,
  activeFlag,
  username,
}) => {
  const id = validateCategoryId(categoryId);
  const name = validateCategoryName(categoryName);
  const status = validateActiveFlag(activeFlag);

  if (!username) {
    throw new AppError("Informasi user tidak ditemukan", 401);
  }

  // Pastikan kategori tersedia
  const existingCategory = await findCategoryById(id);

  if (!existingCategory) {
    throw new NotFoundError("Kategori tidak ditemukan");
  }

  // Cek apakah nama digunakan kategori lain
  const duplicateCategory = await findCategoryByName(name, id);

  if (duplicateCategory) {
    throw new AppError(
      "Nama kategori sudah digunakan oleh kategori lain",
      409
    );
  }

  const updated = await updateCategory({
    categoryId: id,
    categoryName: name,
    activeFlag: status,
    username,
  });

  if (!updated) {
    throw new NotFoundError("Kategori gagal diperbarui");
  }

  return await findCategoryById(id);
};

// ============================================
// DELETE CATEGORY (SOFT DELETE)
// ============================================
export const deleteCategoryService = async ({
  categoryId,
  username,
}) => {
  const id = validateCategoryId(categoryId);

  if (!username) {
    throw new AppError("Informasi user tidak ditemukan", 401);
  }

  const existingCategory = await findCategoryById(id);

  if (!existingCategory) {
    throw new NotFoundError("Kategori tidak ditemukan");
  }

  if (existingCategory.active_flag === 0) {
    throw new AppError("Kategori sudah berstatus Inactive", 409);
  }

  const deleted = await deactivateCategory({
    categoryId: id,
    username,
  });

  if (!deleted) {
    throw new AppError("Kategori gagal dinonaktifkan", 409);
  }

  return {
    category_id: id,
    category_name: existingCategory.category_name,
    active_flag: 0,
  };
};
