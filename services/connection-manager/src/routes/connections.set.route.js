import { Router } from "express";
import { setConnectionHandler } from "../controllers/connection.set.controller.js";

const router = Router();
router.post("/connection", setConnectionHandler);

export default router;
