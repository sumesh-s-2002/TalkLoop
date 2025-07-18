import express from "express"
import cors from "cors"
import morgan from "morgan"
import { config } from "dotenv"
import authRoutes from "./routes/Auth/index.js"
import { authMiddleware } from "./middleware/auth.middleware.js"
config();

const app = express();
const instanceId = process.env.HOSTNAME || "unknown instnace";

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api", authRoutes);
app.get("/test", authMiddleware, (req, res) => {
    res.send(req.user);
})
app.get("/healthz", (_, res) => res.send("OK"));



export default app;