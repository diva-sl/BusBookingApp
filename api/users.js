import express from "express";
import cors from "cors";
import { userRoute } from "./routes/usersRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoute);

export default app;
