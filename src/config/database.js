const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("order", "root", "1234",{
    host: "localhost",
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