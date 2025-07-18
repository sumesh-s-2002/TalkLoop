import { Router } from "express";
import { logoutController } from "../../controllers/Auth/auth.logout.controller.js";

const router = Router();
router.post("/logout", logoutController);

export default router;