export function sendToQueue(queueName, message, channel) {
  channel.assertQueue(queueName, { durable: true }, (error, ok) => {
    if (error) {
      console.log("Failed to assert the queue :", error);
      return;
    }
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queueName, messageBuffer, { persistent: true });
    console.log("Data is available on the queue :", queueName);
  });
}
