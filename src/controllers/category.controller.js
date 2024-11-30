const Category = require("../models/category");

exports.createCategory = async (req,res) => {

    try{

        const category = await Category.create(req.body);
        res.status(201).json(category);


    }catch(e){

        res.status(500).json({error: e.message});

    }
}