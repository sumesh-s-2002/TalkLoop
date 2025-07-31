import {assert, NotFoundError, InternalServerError} from "../../shared/utils/httpErrors.js"
import { redisPublisher } from "../redis/index.js";
import { redisSubscriber } from "../redis/index.js";
import axios from "axios"

export async function sendMessage({ to, message, userId }) {
    try {
        const url = `http://connection-manager:6000/api/connections/${to}`;
        const response = await axios.get(url); 
        const data = response.data;            

        const server_id = data.serverId;
        const socket_id = data.socketId;

        assert(server_id && socket_id, NotFoundError, "Cannot find server or user is disconnected from the server");

        const payload = JSON.stringify({
            to,
            from: userId,
            socketId: socket_id,
            message
        });

        await redisPublisher.publish(server_id, payload);
        console.log(`Message published to the server: ${server_id}`);
    } catch (err) {
        console.log("Error in sendMessage:", err);
        throw err;
    }
}

export function receiveMessage(io) {
    redisSubscriber.on("message", (channel, message) => {

        const data = JSON.parse(message);
        console.log(data);
        const { to, from, message: msg, socketId } = data;
        const socket = io.sockets.sockets.get(socketId);
        socket.emit("chat-message", { from, message: msg });
    });
}