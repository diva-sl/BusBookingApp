const mongoose = require("mongoose");

// Ensure mongo_url is provided either in Vercel's environment variables or locally
const mongoUrl = process.env.mongo_url;
//|| "your-local-mongo-uri-here"; // Fallback for local development

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDB connection established");
});
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// const mongoose = require("mongoose");

// mongoose.connect(process.env.mongo_url)

// const db = mongoose.connection;

// db.on("connected", () => {
//   console.log("Mongo Db Connection succesfull")
// })
// db.on("error", () => {
//   console.log("Mongo Db Connection Failed")
// })

// // const { Sequelize } = require("sequelize");
// // const dotenv = require("dotenv");
// // dotenv.config({ path: "../.env" });

// // const sequelize = new Sequelize(
// //   process.env.DB_NAME,
// //   process.env.DB_USER,
// //   process.env.DB_PASSWORD,
// //   {
// //     host: process.env.DB_HOST,
// //     port: process.env.DB_PORT,
// //     dialect: "postgres",
// //     logging: false, // Disable logging; default: console.log
// //   }
// // );

// // const connectDB = async () => {
// //   try {
// //     await sequelize.authenticate();
// //     console.log("Connection has been established successfully.");
// //   } catch (error) {
// //     console.error("Unable to connect to the database:", error);
// //   }
// // };
