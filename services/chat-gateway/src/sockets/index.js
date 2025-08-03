import os from "os";
import { assert, BadRequestError } from "../../shared/utils/httpErrors.js";
import axios from "axios";
import { sendMessage } from "../services/redit.services.js";
import { sendToQueue } from "../../shared/rabbitMQ/producer.js";
import { getRabbitMQConnection } from "../../shared/rabbitMQ/connection.js";


export function registerSocketHandlers(io) {
  io.on("connection", async (socket) => {
    try {
      socket.on("chat-message", async (data) => {
        try {
          const { to, message } = data;
          assert(
            to && message,
            BadRequestError,
            "cannot find to address or message!"
          );
          await sendMessage({ to, message, userId: socket.user.id });
        } catch (err) {
          if (err.status === 404) {
            const channel = getRabbitMQConnection();
            if (!channel) {
              console.log(
                "No connection found to the rabbitMQ, will create a connection"
              );
            }
            // sendin the log to log service
            sendToQueue(
              "log-queue",
              {
                level: "info",
                message: "user is offline",
                meta: { user_id: data.to, service: "chat-server"},
              },
              channel
            );
            //sending the message to the relay service
            sendToQueue(
              "relay-queue",
              {
                to: data.to,
                message: data.message,
                from: socket.user.id,
              },
              channel
            );
          }
        }
      });

      console.log(
        `User connected using transport: ${socket.conn.transport.name}`
      );
      const user_id = socket.user?.id;
      assert(user_id, BadRequestError, "user id not found!");
      const server_id = os.hostname();
      const socket_id = socket.id;
      const response = await axios.post(
        "http://connection-manager:6000/api/connection",
        {
          serverId: server_id,
          userId: user_id,
          socketId: socket_id,
        }
      );
      if (response.status == 200)
        console.log(`Connection registered for the user: ${user_id}`);

      socket.on("disconnect", (reason) => {
        console.log(
          `User ${user_id} with socket ${socket_id} is disconnected and removed. reason ${reason}`
        );
      });
    } catch (err) {
      console.log("Something went wrong when establiching connection!", err);
    }
  });
}
