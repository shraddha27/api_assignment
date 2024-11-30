const express = require("express");
const productController = require("../controllers/product.controller");
const categoryController = require("../controllers/category.controller");
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "uploads/"});

router.post("/product", async(req,res) => {
    try{
        const product = await productController.createProduct(req.body);
        res.status(201).json(product);
    }catch(e){
        res.status(400).json(e.message);
    }
});

router.get("/product", async(req,res) => {
    try{
        const products = await productController.getProducts(req.query);
        res.status(200).json(products);
    }catch(e){
        res.status(500).json(e.message);
    }
});

router.post("/user", userController.createUser);
router.post("/category", categoryController.createCategory);
router.post("/product/bulkCreate", upload.single('file'), productController.bulkUpload);
router.get("/product/downloadReport", productController.downloadReport);


module.exports = router;