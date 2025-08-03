export async function listenToQueue(channel, queueName, messageHandler) {
  await channel.assertQueue(queueName, { durable: true });
  await channel.prefetch(1);

  console.log(`Listening to queue: ${queueName}`);

  await channel.consume(
    queueName,
    async (message) => {
      if (!message) return;

      try {
        const payload = JSON.parse(message.content.toString());
        await messageHandler(payload);
        channel.ack(message);
      } catch (error) {
        console.error(
          `Error handling message from queue '${queueName}':`,
          error
        );
        channel.nack(message, false, false);
      }
    },
    { noAck: false }
  );
}
