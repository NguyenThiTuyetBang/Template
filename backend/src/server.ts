import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api";
import connectDB from "./config/db";

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
