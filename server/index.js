import dotenv from "dotenv";
dotenv.config(); // MUST be at top

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";

import Connection from "./database/db.js";
import Routes from "./routes/Routes.js";
import setupSocket from "./socket.js";

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

// ---------- HTTP + Socket Server ----------
const server = http.createServer(app);
setupSocket(server);

// ---------- Start Server ----------
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on PORT ${PORT}`);
});
