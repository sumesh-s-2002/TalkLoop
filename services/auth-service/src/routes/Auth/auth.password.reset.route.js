import { Router } from "express";
import { passwordResetController } from "../../controllers/Auth/auth.reset.password.controller.js";

const router = Router();
router.post("/reset-password", passwordResetController);

export default router;