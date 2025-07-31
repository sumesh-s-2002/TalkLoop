import amqp from "amqplib"
import {config } from "dotenv"
import {assert, BadRequestError} from "../../shared/utils/httpErrors.js"
import { Message } from "../models/message.model.js";
config();

export async function setupRabbitMQ(){
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    return channel;
}

export async function listenToQueue(channel, queueName) {
    try {
        channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async (msg) => {
            const payload = JSON.parse(msg.content.toString());
            assert(payload && payload.from && payload.to && payload.message, BadRequestError, "some of the fields are missing at relay service rabbitMQ consumer");
            await Message.create(payload);
            channel.ack(msg);
        })
    } catch (err) {
        channel.nack(mag, false, false);
        console.log("Something went wrong : ", err);
    }
}





