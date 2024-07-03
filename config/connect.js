const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, // Disable logging; default: console.log
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });

module.exports = sequelize;
