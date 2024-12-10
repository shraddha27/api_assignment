const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "report-producer",
  brokers: ["kafka:9092"], // Kafka broker running in Docker
});

const producer = kafka.producer();

async function sendReportRequest(reportType) {
  await producer.connect();
  const message = { value: JSON.stringify({ type: reportType, requestedAt: new Date() }) };

  await producer.send({
    topic: "report-request",
    messages: [message],
  });

  console.log(`Report request sent for type: ${reportType}`);
  await producer.disconnect();
}

module.exports = { sendReportRequest };
