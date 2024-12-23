const express = require("express");
const cors = require("cors");
const userRoute = require("../routes/usersRoute.js");
const busRoute = require("../routes/busesRoute.js");
const bookingRoute = require("../routes/bookingRoute.js");
require("dotenv").config();
const connectDB = require("../config/connect.js");

const app = express();
 console.log(connectDB);
// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoute);
app.use("/buses", busRoute);
app.use("/api/booking", bookingRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
