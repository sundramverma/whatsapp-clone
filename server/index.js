import dotenv from "dotenv";
dotenv.config(); // MUST be at top

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import Connection from "./database/db.js";
import Routes from "./routes/Routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// ---------- Middlewares ----------
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ---------- Health Check Route ----------
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

// ---------- API Routes ----------
app.use("/", Routes);

// ---------- Database Connection ----------
Connection();

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running successfully on PORT ${PORT}`);
});
