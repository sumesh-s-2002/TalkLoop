import { Router } from "express";
import { verifyEmailController } from "../../controllers/Auth/auth.verify.email.controller.js";

const router = Router();
router.get("/verify-email/:token", verifyEmailController);

export default router;