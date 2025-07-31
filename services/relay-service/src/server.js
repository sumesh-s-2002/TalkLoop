
import http from "node:http"
import process from "node:process"
import app from "./app.js"
import { config } from "dotenv";
import { setupRabbitMQ, listenToQueue } from "./services/rabitmq.service.js";
import { initClient } from "./config/mongo.client.js";
config();

const server = http.createServer(app);

server.listen(process.env.PORT , '0.0.0.0' ,() => {
    console.log(`connection manager listening to port ${process.env.PORT}`);
});


//consumer program listening to the the chat-serve
await initClient();
const channel = await setupRabbitMQ();
await listenToQueue(channel, "relay-queue")


//grateful shutdown
async function shutdown(signal) {
    console.log(`${signal} received, shutting down !`);
    server.close();
    process.exit(0);
}

["SIGINT", "SIGTERM"].forEach(sig => {
    process.on(sig, () => shutdown(sig))
});


