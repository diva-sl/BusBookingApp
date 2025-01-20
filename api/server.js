require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./usersRoute.js");
const busRoute = require("./busesRoute.js");
const bookingRoute = require("./bookingRoute.js");
const connectDB = require("./config/connect.js");

const app = express();
// Connect to the database
//connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoute);
app.use("/buses", busRoute);
app.use("/api/bookings", bookingRoute);

// heroku enviroment
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   // const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client/build/index.html"));
//   });
// }
// Start server
app.use(
  cors({
    origin: "https://vought-bus.vercel.app", // Replace with your frontend URL
    credentials: true,
  })
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
