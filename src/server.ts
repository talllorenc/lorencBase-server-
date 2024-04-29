require("dotenv").config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
const { logger, toLog } = require('./middleware/logger')

const app = express();

app.use(logger);
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use("/api", routes);

const dbConnectionString = process.env.MONGO_URL;
mongoose.Promise = Promise;
mongoose.connect(dbConnectionString);
mongoose.connection.on("error", (error) =>{
  console.log(error)
  toLog(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoErrLog.log')
})

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("🚀 Server running on!");
});
