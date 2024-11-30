const Product = require("../models/product");
const Category = require("../models/category");
const {Op} = require("sequelize");
const path = require("path");
const XLSX = require("xlsx");
const {parse} = require("json2csv");
const fs = require("fs");
const csv = require("csv-parser");


exports.createProduct = async (data) => {
    const {name, productPrice, categoryId, productImage} = data;
    return await Product.create({name, productPrice, categoryId, productImage});
};

exports.getProducts = async(query) => {
    const {page=1, limit=10, order="asc", search} = query;
    const offset = (page-1) * limit;
    const where = search ? {
        [Op.or]: [
           { name: {[Op.like]: `%${search}%` } },
           { "$Category.name$": {[Op.like]: `%${search}%`}}
        ]
    }:{};

    return await Product.findAndCountAll({
        include: [{model: Category, as: 'Category', attributes: ["name"]}],
        where,
        limit: parseInt(limit),
        offset,
        order: [["productPrice", order]]
    })
};

exports.bulkUpload = async (req, res) => {

    const file = req.file;
    
    try{

        
        if(!file){
            return res.status(400).send({message: "No File Uploaded"});
        }

        const products = [];
        const categories = new Set();
        const fileExt = path.extname(file.originalname).toLowerCase();

        if(fileExt === ".csv"){
            console.log(file.path);

            fs.createReadStream(file.path).pipe(csv()).on('data', (row) => {
                const {productName, productPrice, productCategory} = row;
                categories.add(productCategory);
                products.push({
                    name: productName,
                    productPrice: parseFloat(productPrice),
                    productCategory
                })
            }).on("end",async () =>{
                try{
                    const categoryNames = Array.from(categories);
                    const createdCategories = [];
                    for (const name of categoryNames) {
                    const [category, created] = await Category.findOrCreate({
                        where: { name },
                    });
                    createdCategories[category.name] = category.categoryId; // Collect all the categories created or found
                    }
        
                    const productData = products.map((product)=>({
                        name: product.name,
                        productPrice:product.productPrice,
                        productImage: product.productImage,
                        categoryId: createdCategories[product.productCategory]
                    }));

            await Product.bulkCreate(productData);
            res.status(200).json({message: "Products uploaded successfully"});

                }catch(e){}
            })

        }else if(fileExt === ".xlsx"){

            const workbook = XLSX.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            data.forEach((row) => {

                const {productName, productPrice, productImage, productCategory} = row;
                categories.add(productCategory);

                products.push({
                    name: productName,
                    productPrice: parseFloat(productPrice),
                    productImage,
                    productCategory
                });

            });

            const categoryNames = Array.from(categories);
            const createdCategories = [];
            for (const name of categoryNames) {
            const [category, created] = await Category.findOrCreate({
                where: { name },
            });
            createdCategories[category.name] = category.categoryId; // Collect all the categories created or found
            }

            const productData = products.map((product)=>({
                name: product.name,
                productPrice:product.productPrice,
                productImage: product.productImage,
                categoryId: createdCategories[product.productCategory]
            }));

            await Product.bulkCreate(productData);
            res.status(200).json({message: "Products uploaded successfully"});

        }else{
            return res.status(400).send({message: "Invalid file type. Only CSV and XLSX files allowed."})
        }

       

    }catch(e){
        res.status(500).json({message: e.message});

    }finally{
        fs.unlinkSync(file.path);
    }

}

exports.downloadReport = async (req,res) => {
    const {format} = req.query;
    const products = await Product.findAll({include: {model: Category, as: 'Category', attributes: ['name']}});
    const data = products.map((product) => ({

        productId: product.productId,
        productName: product.name,
        productPrice: product.productPrice,
        productImage : product.productImage,
        productCategory: product.Category.name

    }));

    if(format === "csv"){

        const csv = parse(data);
        res.header("Content-Type", "text/csv");
        res.attachment(products.csv);
        return res.send(csv);
    }else{

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        const buffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});
        res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.attachment("productsReport.xlsx");
        return res.send(buffer);

    }
};