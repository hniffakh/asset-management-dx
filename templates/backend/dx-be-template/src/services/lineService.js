
import {
  findAllLines,
  findLineByCode,
  findLineByName,
  insertLine,
  updateLine,
  deleteLine,
} from "../models/lineModel.js";

import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { AppError } from "../errors/AppError.js";

// ============================================
// VALIDATION HELPERS
// ============================================

// VALIDATE TEXT
const validateText = (value, fieldName, maxLength) => {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new ValidationError(`${fieldName} wajib diisi`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > maxLength) {
    throw new ValidationError(
      `${fieldName} maksimal ${maxLength} karakter`
    );
  }

  return trimmedValue;
};

// VALIDATE LINE CODE
const validateLineCode = (lineCode) => {
  return validateText(lineCode, "Line code", 10);
};

// VALIDATE COMPANY CODE
const validateCompanyCode = (companyCode) => {
  return validateText(companyCode, "Company code", 11);
};

// VALIDATE PLANT CODE
const validatePlantCode = (plantCode) => {
  return validateText(plantCode, "Plant code", 5);
};

// VALIDATE BU CODE
const validateBuCode = (buCode) => {
  return validateText(buCode, "BU code", 10);
};

// VALIDATE PRODUCT CODE
const validateProductCode = (productCode) => {
  return validateText(productCode, "Product code", 8);
};

// VALIDATE AREA CODE
const validateAreaCode = (areaCode) => {
  return validateText(areaCode, "Area code", 50);
};

// VALIDATE LINE NAME
const validateLineName = (lineName) => {
  return validateText(lineName, "Line name", 100);
};

// VALIDATE LINE CATEGORY
const validateLineCategory = (lineCategory) => {
  return validateText(lineCategory, "Line category", 50);
};

// VALIDATE FLAG
const validateFlag = (flag) => {
  return validateText(flag, "Flag", 1);
};

// VALIDATE USERNAME
const validateUsername = (username) => {
  return validateText(username, "Username", 10);
};

// ============================================
// GET ALL LINES
// ============================================

export const getAllLinesService = async () => {
  return await findAllLines();
};

// ============================================
// GET LINE BY CODE
// ============================================

export const getLineByCodeService = async (lineCode) => {
  const code = validateLineCode(lineCode);

  const line = await findLineByCode(code);

  if (!line) {
    throw new NotFoundError("Line not found");
  }

  return line;
};

// ============================================
// CREATE LINE
// ============================================

export const createLineService = async ({
  lineCode,
  companyCode,
  plantCode,
  buCode,
  productCode,
  areaCode,
  lineName,
  lineCategory,
  flag,
  username,
}) => {
  const code = validateLineCode(lineCode);
  const company = validateCompanyCode(companyCode);
  const plant = validatePlantCode(plantCode);
  const bu = validateBuCode(buCode);
  const product = validateProductCode(productCode);
  const area = validateAreaCode(areaCode);
  const name = validateLineName(lineName);
  const category = validateLineCategory(lineCategory);
  const lineFlag = validateFlag(flag);
  const user = validateUsername(username);

  // CHECK USER
  if (!user) {
    throw new AppError("User information not found", 401);
  }

  // CHECK LINE CODE DUPLICATE
  const existingCode = await findLineByCode(code);

  if (existingCode) {
    throw new AppError(
      "Line code already registered",
      409
    );
  }

  // CHECK LINE NAME DUPLICATE
  const existingName = await findLineByName(name);

  if (existingName) {
    throw new AppError(
      "Line name already registered",
      409
    );
  }

  const line = await insertLine({
    lineCode: code,
    companyCode: company,
    plantCode: plant,
    buCode: bu,
    productCode: product,
    areaCode: area,
    lineName: name,
    lineCategory: category,
    flag: lineFlag,
    username: user,
  });

  return line;
};

// ============================================
// UPDATE LINE
// ============================================

export const updateLineService = async ({
  oldLineCode,
  newLineCode,
  companyCode,
  plantCode,
  buCode,
  productCode,
  areaCode,
  lineName,
  lineCategory,
  flag,
  username,
}) => {
  const oldCode = validateLineCode(oldLineCode);
  const newCode = validateLineCode(newLineCode);

  const company = validateCompanyCode(companyCode);
  const plant = validatePlantCode(plantCode);
  const bu = validateBuCode(buCode);
  const product = validateProductCode(productCode);
  const area = validateAreaCode(areaCode);
  const name = validateLineName(lineName);
  const category = validateLineCategory(lineCategory);
  const lineFlag = validateFlag(flag);
  const user = validateUsername(username);

  // CHECK USER
  if (!user) {
    throw new AppError("User information not found", 401);
  }

  // CHECK EXISTING LINE
  const existingLine = await findLineByCode(oldCode);

  if (!existingLine) {
    throw new NotFoundError("Line not found");
  }

  // CHECK NEW LINE CODE DUPLICATE
  if (newCode !== oldCode) {
    const duplicateCode = await findLineByCode(newCode);

    if (duplicateCode) {
      throw new AppError(
        "Line code already used by another line",
        409
      );
    }
  }

  // CHECK LINE NAME DUPLICATE
  const duplicateName = await findLineByName(
    name,
    oldCode
  );

  if (duplicateName) {
    throw new AppError(
      "Line name already used by another line",
      409
    );
  }

  const updated = await updateLine({
    oldLineCode: oldCode,
    newLineCode: newCode,
    companyCode: company,
    plantCode: plant,
    buCode: bu,
    productCode: product,
    areaCode: area,
    lineName: name,
    lineCategory: category,
    flag: lineFlag,
    username: user,
  });

  if (!updated) {
    throw new NotFoundError("Line update failed");
  }

  return await findLineByCode(newCode);
};

// ============================================
// DELETE LINE (HARD DELETE)
// ============================================

export const deleteLineService = async ({
  lineCode,
}) => {
  const code = validateLineCode(lineCode);

  const existingLine = await findLineByCode(code);

  if (!existingLine) {
    throw new NotFoundError("Line not found");
  }

  const deleted = await deleteLine(code);

  if (!deleted) {
    throw new AppError("Line deletion failed", 409);
  }

  return {
    line_code: existingLine.line_code,
    line_name: existingLine.line_name,
    message: "Line successfully deleted",
  };
};
