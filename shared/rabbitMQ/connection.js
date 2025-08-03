import { env } from "../config/env.js";
import amqp from "amqplib/callback_api.js";

let Channel = null;

export function connectRabbitMQ() {
  return new Promise((resolve, reject) => {
    amqp.connect(env.rabbitmq_url, (err, connection) => {
      if (err) {
        console.error("Failed to connect to RabbitMQ:", err);
        return reject(err);
      }

      connection.createChannel((err, channel) => {
        if (err) {
          console.error("Failed to create channel:", err);
          connection.close();
          return reject(err);
        }

        Channel = channel;
        console.log("RabbitMQ connected and channel created.");
        resolve();
      });
    });
  });
}

export function getRabbitMQConnection() {
  return Channel;
}
