const { Kafka } = require("kafkajs");
const db = require("./db");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { format } = require("fast-csv");

const kafka = new Kafka({
  clientId: "report-consumer",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "report-group" });

const sharedDir = "/src/reports";

async function generateCSV(filePath) {
  const csvStream = format({ headers: true });
  const writeStream = fs.createWriteStream(filePath);

  csvStream.pipe(writeStream);
  const batchSize = 1000; // Fetch data in chunks
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const products = await Product.findAll({
      attributes: ["name", "price", "id"],
      raw: true,
      limit: batchSize,
      offset,
    });

    for (const product of products) {
      csvStream.write(product);
    }

    if (products.length < batchSize) {
      hasMore = false;
    }
    offset += batchSize;
  }
  csvStream.end();

  console.log(`CSV file generated at ${filePath}`);
}

async function generateXLSX(filePath) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products Report");

  // Adding headers
  worksheet.columns = [
    { header: "Category Name", key: "category_name" },
    { header: "Product Name", key: "product_name" },
    { header: "Product Price", key: "product_price" },
    { header: "Product ID", key: "id" },
  ];

  const batchSize = 1000; // Fetch data in chunks
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const products = await Product.findAll({
      attributes: ["name", "price", "id"],
      raw: true,
      limit: batchSize,
      offset,
    });

    for (const product of products) {
        worksheet.addRows(product);
    }

    if (products.length < batchSize) {
      hasMore = false;
    }
    offset += batchSize;
  }



  await workbook.xlsx.writeFile(filePath);
  console.log(`XLSX file generated at ${filePath}`);
}

async function consume() {
  await consumer.connect();
  await consumer.subscribe({ topic: "report-request", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const request = JSON.parse(message.value.toString());
      console.log("Processing report request:", request);


      const filePath = path.join(sharedDir, `report_${Date.now()}.${request.type}`);
      if (request.type === "csv") {
        await generateCSV(filePath);
      } else if (request.type === "xlsx") {
        await generateXLSX(filePath);
      }
    },
  });
}

module.exports = { consume };
