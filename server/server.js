require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/usersRoute.js");
const busRoute = require("./routes/busesRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.mongo_url)
  .then(() => console.log("Mongo DB connection successful"))
  .catch((err) => console.log("Mongo DB connection failed:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoute);
app.use("/buses", busRoute);
app.use("/api/bookings", bookingRoute);

// CORS Configuration (for Vercel environment)
app.use(
  cors({
    origin: "https://vought-bus.vercel.app", // Allow the front-end domain
    methods: ["GET", "POST"],
    credentials: true, // Ensure credentials (cookies) are sent
  })
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
