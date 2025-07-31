import { getConnectionHandler } from "../controllers/connection.get.controller.js";
import { Router } from "express"

const router = Router();
router.get("/connections/:user_id", getConnectionHandler);

export default router;
