  import {
    findAllOpoq, findOpoqById, findOpoqByName, insertOpoq, updateOpoq, removeOpoq,
  } from "../models/opoqModel.js";
  import { ValidationError } from "../errors/ValidationError.js";
  import { NotFoundError } from "../errors/NotFoundError.js";
  import { AppError } from "../errors/AppError.js";

  const validateId = (v) => {
    const id = Number(v);
    if (!Number.isInteger(id) || id <= 0) throw new ValidationError("ID tidak valid");
    return id;
  };
  const requireUser = (u) => {
    if (!u) throw new AppError("Informasi user tidak ditemukan", 401);
  };

  export const getAllOpoqService = async () => findAllOpoq();

  export const createOpoqService = async ({ itemName, currentStock, orderPoint, orderQty, username }) => {
    requireUser(username);
    const name = String(itemName || "").trim();
    if (!name) throw new ValidationError("Nama item wajib diisi");
    if (await findOpoqByName(name)) throw new AppError("Nama item sudah terdaftar", 409);

    const id = await insertOpoq({ itemName: name, currentStock, orderPoint, orderQty, username });
    return findOpoqById(id);
  };

  export const updateOpoqService = async ({ id, itemName, currentStock, orderPoint, orderQty, username }) => {
    const itemId = validateId(id);
    requireUser(username);
    const name = String(itemName || "").trim();
    if (!name) throw new ValidationError("Nama item wajib diisi");
    if (!(await findOpoqById(itemId))) throw new NotFoundError("Data OPOQ tidak ditemukan");
    if (await findOpoqByName(name, itemId)) throw new AppError("Nama item sudah digunakan", 409);

    await updateOpoq({ id: itemId, itemName: name, currentStock, orderPoint, orderQty, username });
    return findOpoqById(itemId);
  };

  export const deleteOpoqService = async (id) => {
    const itemId = validateId(id);
    if (!(await findOpoqById(itemId))) throw new NotFoundError("Data OPOQ tidak ditemukan");
    await removeOpoq(itemId);
    return { opoq_item_id: itemId };
  };