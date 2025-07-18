import { Router } from "express";
import { forgotPasswordController } from "../../controllers/Auth/auth.forgot.password.controller.js";

const router = Router();
router.post("/forgot-password", forgotPasswordController);

export default router;