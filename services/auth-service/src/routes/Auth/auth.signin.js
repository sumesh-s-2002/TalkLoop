import { Router } from "express";
import { signinController } from "../../controllers/Auth/auth.signin.js";

const router = Router();
router.post("/signin", signinController);

export default router;