import {
    getAllSuppliersService,
    getSupplierByIdService,
    createSupplierService,
    updateSupplierService,
    deleteSupplierService,
} from "../services/supplierService.js";

import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

// GET ALL SUPPLIERS
export const getAllSuppliers = async (req, res, next) => {
    try {
        const result = await getAllSuppliersService();

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Data supplier berhasil diambil",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// GET SUPPLIER BY ID
export const getSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getSupplierByIdService(id);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Detail supplier berhasil diambil",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// CREATE SUPPLIER
export const createSupplier = async (req, res, next) => {
    try {
        const {
            supplier_by,
            supplier_date,
            price_supplier,
        } = req.validated;

        const result = await createSupplierService({
            supplierBy: supplier_by,
            supplierDate: supplier_date,
            priceSupplier: price_supplier,
            username: req.user.username,
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Supplier berhasil ditambahkan",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE SUPPLIER
export const updateSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            supplier_by,
            supplier_date,
            price_supplier,
        } = req.validated;

        const result = await updateSupplierService({
            supplierId: id,
            supplierBy: supplier_by,
            supplierDate: supplier_date,
            priceSupplier: price_supplier,
            username: req.user.username,
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Supplier berhasil diperbarui",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE SUPPLIER (HARD DELETE)
export const deleteSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await deleteSupplierService({
            supplierId: id,
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Supplier berhasil dihapus",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};