import express from "express";
import cors from "cors";
import { bookingRoute } from "./routes/bookingRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoute);

export default app;
