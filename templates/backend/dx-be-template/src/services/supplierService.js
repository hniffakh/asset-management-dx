import { findAllSupplier, findSupplierById, findSupplierByName, insertSupplier, updateSupplier, deleteSupplier} from "../models/supplierModel.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { AppError } from "../errors/AppError.js";

// VALIDATE SUPPLIER ID
const validateSupplierId = (supplierId) => {
    const id = Number(supplierId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError("Supplier ID tidak valid");
    }

    return id;
};

// VALIDATE SUPPLIER BY
const validateSupplierBy = (supplierBy) => {
    if (
        typeof supplierBy !== "string" ||
        !supplierBy.trim()
    ) {
        throw new ValidationError("Nama supplier wajib diisi");
    }

    return supplierBy.trim();
};

// VALIDATE SUPPLIER DATE
const validateSupplierDate = (supplierDate) => {
    if (
        typeof supplierDate !== "string" ||
        !supplierDate.trim()
    ) {
        throw new ValidationError("Tanggal supplier wajib diisi");
    }

    return supplierDate.trim();
};

// VALIDATE PRICE SUPPLIER
const validatePriceSupplier = (priceSupplier) => {
    if (
        typeof priceSupplier !== "number" ||
        !Number.isFinite(priceSupplier) ||
        priceSupplier < 0
    ) {
        throw new ValidationError("Harga supplier harus berupa angka dan tidak boleh negatif");
    }

    return priceSupplier;
};

// GET ALL SUPPLIERS
export const getAllSuppliersService = async () => {
    return await findAllSupplier();
};

// GET SUPPLIER BY ID
export const getSupplierByIdService = async (supplierId) => {
    const id = validateSupplierId(supplierId);

    const supplier = await findSupplierById(id);

    if (!supplier) {
        throw new NotFoundError("Supplier tidak ditemukan");
    }

    return supplier;
};

// CREATE SUPPLIER
export const createSupplierService = async ({
    supplierBy,
    supplierDate,
    priceSupplier,
    username,
}) => {
    const supplier = validateSupplierBy(supplierBy);
    const date = validateSupplierDate(supplierDate);
    const price = validatePriceSupplier(priceSupplier);

    if (!username) {
        throw new AppError("Informasi user tidak ditemukan", 401);
    }

    // Cek supplier duplikat
    const existingSupplier = await findSupplierByName(supplier);

    if (existingSupplier) {
        throw new AppError(
            "Nama supplier sudah terdaftar",
            409
        );
    }

    const newSupplier = await insertSupplier({
        supplierBy: supplier,
        supplierDate: date,
        priceSupplier: price,
        username,
    });

    return newSupplier;
};

// UPDATE SUPPLIER
export const updateSupplierService = async ({
    supplierId,
    supplierBy,
    supplierDate,
    priceSupplier,
    username,
}) => {
    const id = validateSupplierId(supplierId);
    const supplier = validateSupplierBy(supplierBy);
    const date = validateSupplierDate(supplierDate);
    const price = validatePriceSupplier(priceSupplier);

    if (!username) {
        throw new AppError("Informasi user tidak ditemukan", 401);
    }

    // Pastikan supplier tersedia
    const existingSupplier = await findSupplierById(id);

    if (!existingSupplier) {
        throw new NotFoundError("Supplier tidak ditemukan");
    }

    // Cek apakah nama supplier digunakan supplier lain
    const duplicateSupplier = await findSupplierByName(
        supplier,
        id
    );

    if (duplicateSupplier) {
        throw new AppError(
            "Nama supplier sudah digunakan oleh supplier lain",
            409
        );
    }

    const updated = await updateSupplier({
        supplierId: id,
        supplierBy: supplier,
        supplierDate: date,
        priceSupplier: price,
        username,
    });

    if (!updated) {
        throw new NotFoundError("Supplier gagal diperbarui");
    }

    return await findSupplierById(id);
};

// DELETE SUPPLIER (HARD DELETE)
export const deleteSupplierService = async ({
    supplierId,
}) => {
    const id = validateSupplierId(supplierId);

    // Pastikan supplier tersedia
    const existingSupplier = await findSupplierById(id);

    if (!existingSupplier) {
        throw new NotFoundError("Supplier tidak ditemukan");
    }

    const deleted = await deleteSupplier(id);

    if (!deleted) {
        throw new AppError("Supplier gagal dihapus", 409);
    }

    return {
        supplier_id: id,
        supplier_by: existingSupplier.supplier_by,
        message: "Supplier berhasil dihapus",
    };
};