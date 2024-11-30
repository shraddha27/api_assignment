const {Model, DataTypes} = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: "User"
   
});

module.exports = User;
