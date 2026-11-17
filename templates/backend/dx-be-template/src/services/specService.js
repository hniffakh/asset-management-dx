
import { findAllSpecs, findSpecById, findSpecByName, insertSpec, updateSpec, deactivateSpec} from "../models/specModel.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { AppError } from "../errors/AppError.js";

// VALIDATE SPEC ID
const validateSpecId = (specId) => {
  const id = Number(specId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(
      "Spec ID tidak valid"
    );
  }

  return id;
};

// VALIDATE SPEC NAME
const validateSpecName = (specName) => {
  if (
    typeof specName !== "string" ||
    !specName.trim()
  ) {
    throw new ValidationError(
      "Nama spesifikasi wajib diisi"
    );
  }

  return specName.trim();
};

// VALIDATE LIFETIME
const validateLifetime = (
  lifetimeStart,
  lifetimeEnd
) => {
  const validateDate = (value, fieldName) => {
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      throw new ValidationError(
        `${fieldName} harus menggunakan format YYYY-MM-DD`
      );
    }

    const [year, month, day] = value
      .split("-")
      .map(Number);

    const date = new Date(
      Date.UTC(year, month - 1, day)
    );

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new ValidationError(
        `${fieldName} bukan tanggal yang valid`
      );
    }

    return value;
  };

  // Validate lifetime start
  const startDate = validateDate(
    lifetimeStart,
    "Lifetime start"
  );

  // Validate lifetime end
  const endDate = validateDate(
    lifetimeEnd,
    "Lifetime end"
  );

  // Validate date range
  if (endDate < startDate) {
    throw new ValidationError(
      "Lifetime end tidak boleh lebih awal dari lifetime start"
    );
  }

  return {
    lifetime_start: startDate,
    lifetime_end: endDate,
  };
};

// VALIDATE ACTIVE FLAG
const validateActiveFlag = (activeFlag) => {
  if (
    activeFlag !== 0 &&
    activeFlag !== 1
  ) {
    throw new ValidationError(
      "Status spesifikasi hanya boleh 0 (Inactive) atau 1 (Active)"
    );
  }

  return activeFlag;
};

// GET ALL SPECS
export const getAllSpecsService = async () => {
  return await findAllSpecs();
};

// GET SPEC BY ID
export const getSpecByIdService = async (specId) => {
  const id = validateSpecId(specId);

  const spec = await findSpecById(id);

  if (!spec) {
    throw new NotFoundError(
      "Spesifikasi tidak ditemukan"
    );
  }

  return spec;
};

// CREATE SPEC
export const createSpecService = async ({
  specName,
  lifetimeStart,
  lifetimeEnd,
  activeFlag = 1,
  username,
}) => {
  const name = validateSpecName(specName);

  const validLifetime = validateLifetime(
    lifetimeStart,
    lifetimeEnd
  );

  const status = validateActiveFlag(activeFlag);

  if (!username) {
    throw new AppError(
      "Informasi user tidak ditemukan",
      401
    );
  }

  // Check duplicate specification name
  const existingSpec = await findSpecByName(name);

  if (existingSpec) {
    throw new AppError(
      "Nama spesifikasi sudah terdaftar",
      409
    );
  }

  // Insert specification
  const spec = await insertSpec({
    specName: name,
    lifetimeStart: validLifetime.lifetime_start,
    lifetimeEnd: validLifetime.lifetime_end,
    activeFlag: status,
    username,
  });

  return spec;
};

// UPDATE SPEC
export const updateSpecService = async ({
  specId,
  specName,
  lifetimeStart,
  lifetimeEnd,
  activeFlag,
  username,
}) => {
  const id = validateSpecId(specId);

  const name = validateSpecName(specName);

  const validLifetime = validateLifetime(
    lifetimeStart,
    lifetimeEnd
  );

  const status = validateActiveFlag(activeFlag);

  if (!username) {
    throw new AppError(
      "Informasi user tidak ditemukan",
      401
    );
  }

  // Check specification existence
  const existingSpec = await findSpecById(id);

  if (!existingSpec) {
    throw new NotFoundError(
      "Spesifikasi tidak ditemukan"
    );
  }

  // Check duplicate specification name
  const duplicateSpec = await findSpecByName(
    name,
    id
  );

  if (duplicateSpec) {
    throw new AppError(
      "Nama spesifikasi sudah digunakan oleh spesifikasi lain",
      409
    );
  }

  // Update specification
  const updated = await updateSpec({
    specId: id,
    specName: name,
    lifetimeStart: validLifetime.lifetime_start,
    lifetimeEnd: validLifetime.lifetime_end,
    activeFlag: status,
    username,
  });

  if (!updated) {
    throw new NotFoundError(
      "Spesifikasi gagal diperbarui"
    );
  }

  return await findSpecById(id);
};

// DELETE SPEC
export const deleteSpecService = async ({
  specId,
  username,
}) => {
  const id = validateSpecId(specId);

  if (!username) {
    throw new AppError(
      "Informasi user tidak ditemukan",
      401
    );
  }

  // Check specification existence
  const existingSpec = await findSpecById(id);

  if (!existingSpec) {
    throw new NotFoundError(
      "Spesifikasi tidak ditemukan"
    );
  }

  // Check current status
  if (Number(existingSpec.active_flag) === 0) {
    throw new AppError(
      "Spesifikasi sudah berstatus Inactive",
      409
    );
  }

  // Deactivate specification
  const deleted = await deactivateSpec({
    specId: id,
    username,
  });

  if (!deleted) {
    throw new AppError(
      "Spesifikasi gagal dinonaktifkan",
      409
    );
  }

  return {
    spec_id: id,
    spec_name: existingSpec.spec_name,
    lifetime_start: existingSpec.lifetime_start,
    lifetime_end: existingSpec.lifetime_end,
    active_flag: 0,
  };
};
