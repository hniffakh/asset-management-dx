import express from "express";
import { getOpoq, upsertOpoq, resetOpoq } from "../controllers/opoqController.js";

const router = express.Router();

router.get("/", getOpoq);
router.put("/:deviceId", upsertOpoq);
router.delete("/:deviceId", resetOpoq);

export default router;