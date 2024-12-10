const Product = require("../models/product");
const Category = require("../models/category");
const { Op } = require("sequelize");
const path = require("path");
const XLSX = require("xlsx");
const { parse } = require("json2csv");
const fs = require("fs");
const csv = require("csv-parser");
const { sendReportRequest } = require('../services/producer/reportProducer');


exports.createProduct = async (data) => {
    const { name, productPrice, categoryId, productImage } = data;
    return await Product.create({ name, productPrice, categoryId, productImage });
};

exports.getProducts = async (query) => {
    const { page = 1, limit = 10, order = "asc", search } = query;
    const offset = (page - 1) * limit;
    const where = search ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { "$Category.name$": { [Op.like]: `%${search}%` } }
        ]
    } : {};

    return await Product.findAndCountAll({
        include: [{ model: Category, as: 'Category', attributes: ["name"] }],
        where,
        limit: parseInt(limit),
        offset,
        order: [["productPrice", order]]
    })
};


exports.bulkUpload = async (req, res) => {

    try {
        const filePath = req.file.path;
        const fileType = path.extname(req.file.originalname).toLowerCase();

        if (fileType !== ".csv" && fileType !== ".xlsx") {
            return res.status(400).json({ error: "Unsupported file format. Please upload a CSV or Excel file." });
        }

        // Parse the file into chunks
        const chunks = await fileProcessor.processFile(filePath, fileType);

        // Send chunks to Kafka
        await kafkaProducer.sendChunks("product-topic", chunks);

        res.status(200).json({ message: "File uploaded and chunks sent to Kafka." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}



exports.downloadReport = async (req, res) => {
    try {

        const { type } = req.params;
        const filePath = path.join(__dirname, `../reports/products.${type}`);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            try {
                // If the file doesn't exist, trigger the Kafka producer to generate it
                await sendReportRequest({ type });

                return res.status(202).send({
                    message: "The report is being generated. Please try again later.",
                });
            } catch (error) {
                console.error("Error triggering report generation:", error);
                return res.status(500).send({ error: "Failed to initiate report generation" });
            }
        }

        // If the file exists, serve it for download
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=products.${type}`
        );
        res.setHeader(
            "Content-Type",
            type === "csv"
                ? "text/csv"
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};