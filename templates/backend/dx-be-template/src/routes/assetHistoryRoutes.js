import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getAssetHistory } from "../controllers/replacementController.js";

const router = Router();

router.use(authenticate);
router.get("/", getAssetHistory);

export default router;