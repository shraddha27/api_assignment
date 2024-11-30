const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.createUser= async(req, res) =>{
    const {email, password} = req.body;
    try{
        console.log("email",email);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("password",hashedPassword);
        const user = await User.create({email, password: hashedPassword});
        res.status(201).json(user);
    }catch(e){
        res.status(500).json({error: e.message});
    }
}