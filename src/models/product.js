const {Model, DataTypes} = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");


//module.exports = (sequelize) => {
class Product extends Model {}

Product.init({

    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productImage:{
        type: DataTypes.STRING
    },
    productPrice:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    productId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    categoryId:{
        type: DataTypes.UUID,
        references:{
            model: "Category",
            key: "categoryId"
        },
        allowNull: false

    }
},{
    sequelize,
    modelName: "Product"
});

//Product.belongsTo(Category,{foreignKey: "categoryId", onDelete: "CASCADE"});
Product.belongsTo(Category, {
    foreignKey: 'categoryId', // Specify the foreign key explicitly
    as: 'Category', // Alias to refer to Category when querying
  });
//Category.hasMany(Product);

//return Product;
//}

module.exports = Product;