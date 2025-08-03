import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  connectRabbitMQ,
  getRabbitMQConnection,
} from "../shared/rabbitMQ/connection.js";
import { listenToQueue } from "../shared/rabbitMQ/consumer.js";
import { messageHandler } from "./services/message.handler.service.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use("/test", (req, res) => {
  res.send({ data: "hellow world" });
});

const port = process.env.PORT;

app.listen(port, "0.0.0.0", () => {
  console.log(`The logger service is listening to the port ${port}`);
});

await connectRabbitMQ();
const channel = getRabbitMQConnection();
if (channel) {
  await listenToQueue(channel, "log-queue", (message) => {
    console.log("came here");
    messageHandler(message);
  });
}
