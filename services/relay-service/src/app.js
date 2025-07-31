import express, { json } from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(morgan("dev"));

app.use("/test", (req, res)=>{
    res.send({data : "hellow world"});
});

export default app;