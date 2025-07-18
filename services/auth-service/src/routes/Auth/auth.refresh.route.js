import { Router } from "express";
import { refreshController } from "../../controllers/Auth/auth.refresh.js";

const router = Router();
router.post("/refresh", refreshController);

export default router;