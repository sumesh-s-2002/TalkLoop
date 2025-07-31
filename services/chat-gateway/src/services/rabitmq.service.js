import { env } from "../config/env.js";
import amqp from "amqplib/callback_api.js";

export function sendToQueue(queueName, message) {
    amqp.connect(env.rabbitmq_url, (error, connection) => {
        if (error) {
            console.error("Failed to connect to RabbitMQ:", error);
            return; 
        }
        connection.createChannel((error, channel) => {
            if (error) {
                console.error("Failed to create a channel:", error);
                connection.close(); 
                return;
            }
            channel.assertQueue(queueName, {
                durable: true
            }, (error, ok) => {
                if (error) {
                    console.error(`Failed to assert queue '${queueName}':`, error);
                    channel.close();
                    connection.close();
                    return;
                }
                const messageBuffer = Buffer.from(JSON.stringify(message));
                channel.sendToQueue(queueName, messageBuffer, { persistent: true });
                console.log("Data is available on the queue");
                setTimeout(() => {
                    channel.close((err) => {
                        if (err) console.error("Error closing channel:", err);
                        else console.log("Channel closed.");
                    });
                    connection.close((err) => {
                        if (err) console.error("Error closing connection:", err);
                        else console.log("Connection closed.");
                    });
                }, 500); 
            });
        });
    });
}