const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute.js");
const busRoute = require("./routes/busRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
require("dotenv").config();
const dbConnect = require("../config/connect.js");
const app = express();

app.use(cors());

app.use(express.join());
app.use("/user", userRoute);
app.use("/buses", busRoute);
app.use("/api/booking", bookingRoute);

app.listen(5000, () => {
  console.log("in");
});
