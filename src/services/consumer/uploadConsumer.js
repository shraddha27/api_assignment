const { Kafka } = require("kafkajs");
const db = require("./db"); // A service to handle database operations
const Product = require("../../controllers/product.controller");

const kafka = new Kafka({
  clientId: "product-consumer",
  brokers: ["localhost:9092"], // Replace with your Kafka broker(s)
});

const consumer = kafka.consumer({ groupId: "product-group" });

async function consume(topic) {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const products = JSON.parse(message.value.toString());
      console.log("Processing chunk:", products);

      // Save products to the database
      try {
        await Product.createProduct(products);
        console.log("Chunk processed and saved to database.");
      } catch (error) {
        console.error("Error saving products to database:", error.message);
      }
    },
  });
}

module.exports = { consume };
