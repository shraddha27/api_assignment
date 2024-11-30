const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: true
});

(async () => {
    try{
        await sequelize.authenticate();
        console.log("Database connection established successfully");
    }catch(err){
        console.error("Unable to connect to Database "+err);
    }

})();




module.exports = sequelize;