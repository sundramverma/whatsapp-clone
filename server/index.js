import dotenv from "dotenv";
dotenv.config(); // 🔴 MUST be at top

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import Connection from "./database/db.js";
import Routes from "./routes/Routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/", Routes);

// Database connection
Connection();

// Server start
app.listen(PORT, () =>
  console.log(`🚀 Server running successfully on PORT ${PORT}`)
);
