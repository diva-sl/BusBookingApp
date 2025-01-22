import express from "express";
import cors from "cors";
import { busRoute } from "./routes/busesRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/buses", busRoute);

export default app;
