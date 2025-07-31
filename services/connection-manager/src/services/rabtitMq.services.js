import amqp from "amqplib/callback_api.js";
import  env  from "../config/env.js"
import {assert, BadRequestError} from "../../shared/utils/httpErrors.js"

export function startConsumer(queue_name, handlerFn) {
    amqp.connect(env.rabbitmq_url, (error, connection) => {
        if (error) throw error;

        connection.createChannel((error, channel) => {
            if (error) throw error;

            channel.assertQueue(queue_name, { durable: true });
            channel.prefetch(1);

            channel.consume(queue_name, (msg) => {
                const content = JSON.parse(msg.content);
                assert(content, BadRequestError, "No content found");
                console.log(`Received message on queue ${queue_name}`, content);

                (async () => {
                    try {
                        await handlerFn(content);
                        channel.ack(msg);
                    } catch (err) {
                        console.log(`Error in ${queue_name} handler`, err);
                        channel.nack(msg, false, false);
                    }
                })();
            }, { noAck: false });
        });
    });
}
