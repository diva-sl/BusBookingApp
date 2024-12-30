const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url)

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongo Db Connection succesfull")
})
db.on("error", () => {
  console.log("Mongo Db Connection Failed")
})

// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");
// dotenv.config({ path: "../.env" });

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false, // Disable logging; default: console.log
//   }
// );

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

