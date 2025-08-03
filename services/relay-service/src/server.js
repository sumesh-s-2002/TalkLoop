import http from "node:http";
import process from "node:process";
import app from "./app.js";
import { config } from "dotenv";
import {
  connectRabbitMQ,
  getRabbitMQConnection,
} from "../shared/rabbitMQ/connection.js";
import { listenToQueue } from "../shared/rabbitMQ/consumer.js";
import { handleMessage } from "./services/storeMessage.js";
import { initClient } from "./config/mongo.client.js";
config();

const server = http.createServer(app);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`connection manager listening to port ${process.env.PORT}`);
});
//connect to mongodb
await initClient();
//make rabbitMQ connection
await connectRabbitMQ();
const channel = getRabbitMQConnection();
if (channel) {
  await listenToQueue(channel, "relay-queue", async (payload) => {
    await handleMessage(payload);
  });
}

//grateful shutdown
async function shutdown(signal) {
  console.log(`${signal} received, shutting down !`);
  server.close();
  process.exit(0);
}

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig, () => shutdown(sig));
});
