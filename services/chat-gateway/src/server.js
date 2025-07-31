import app from "./app.js"
import http from "node:http"
import { Server } from "socket.io"
import { env } from "./config/env.js";
import socketAuthMiddleware from "./middlewares/authMiddleware.js";
import { registerSocketHandlers } from "./sockets/index.js";
import { receiveMessage } from "./services/redit.services.js";
import { redisSubscriber } from "./redis/index.js";
import os from "os"

const server = http.createServer(app);
const io = new Server(server, {
    path: "/api/chat/connect",
    transports: ["websocket"],
});

io.use(socketAuthMiddleware);


const serverId = os.hostname();
redisSubscriber.subscribe(serverId);
receiveMessage(io);

registerSocketHandlers(io);

server.listen(env.port,'0.0.0.0', ()=>{
    console.log(`server is listening to PORT ${env.port}`);
})




