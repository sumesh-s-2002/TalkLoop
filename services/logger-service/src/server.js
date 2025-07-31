import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use("/test", (req, res)=>{
    res.send({data : "hellow world"});
});

const port = process.env.PORT;

app.listen(port, '0.0.0.0', ()=>{
    console.log(`The logger service is listening to the port ${port}`);
})

