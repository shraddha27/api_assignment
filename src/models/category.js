const {Model, DataTypes} = require("sequelize");
const sequelize = require("../config/database");


//module.exports = (sequelize) => {
class Category extends Model {}

Category.init({

    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
},{
    sequelize,
    modelName: "Category"
});

//return Category;

//}

module.exports = Category;