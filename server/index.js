import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";

import Connection from "./database/db.js";
import Routes from "./routes/Routes.js";
import setupSocket from "./socket.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

app.use("/", Routes);

Connection();

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on PORT ${PORT}`);
});
