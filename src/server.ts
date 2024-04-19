require("dotenv").config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
const { logger, toLog } = require('./middleware/logger')

const app = express();
app.use(logger);

const allowedOrigins = [
  "https://lorenc-base.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use("/api", routes);

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("Server running on!");
});

const dbConnectionString = process.env.MONGO_URL;
mongoose.Promise = Promise;
mongoose.connect(dbConnectionString);
mongoose.connection.on("error", (error) =>{
  console.log(error)
  toLog(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoErrLog.log')
})
