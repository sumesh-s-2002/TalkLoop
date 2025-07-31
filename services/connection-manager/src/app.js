import express, { json } from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import getConnectionRoute from "./routes/connections.get.route.js"
import setConnectionRoute from "./routes/connections.set.route.js"
dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(morgan("dev"));


app.use("/api", getConnectionRoute);
app.use("/api", setConnectionRoute);

app.use("/test", (req, res)=>{
    res.send({data : "hellow world"});
});

export default app;