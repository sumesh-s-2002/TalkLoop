import { Router } from "express";
import { verifyPasswordTokenController } from "../../controllers/Auth/auth.verify.password.token.controller.js";

const router = Router();
router.get("/password-reset/:token", verifyPasswordTokenController);

export default router;