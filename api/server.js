const express = require("express");
const cors = require("cors");
const userRoute = require("./users.js");
const busRoute = require("./buses.js");
const bookingRoute = require("./booking.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoute);
app.use("/buses", busRoute);
app.use("/api/bookings", bookingRoute);

module.exports = app;
