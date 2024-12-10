const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "product-producer",
  brokers: ["localhost:9092"], // Replace with your Kafka broker(s)
});

const producer = kafka.producer();

async function sendChunks(topic, chunks) {
  await producer.connect();

  for (let i = 0; i < chunks.length; i++) {
    const message = { value: JSON.stringify(chunks[i]) };
    await producer.send({
      topic,
      messages: [message],
    });
    console.log(`Chunk ${i + 1} sent to topic ${topic}`);
  }

  await producer.disconnect();
}

module.exports = { sendChunks };
