require("dotenv").config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import routes from "./routes/index";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: "set-cookie",
  })
);
app.use(express.json());
app.use("/api", routes);

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("Server running on!");
});

const dbConnectionString = process.env.MONGO_URL;
mongoose.Promise = Promise;
mongoose.connect(dbConnectionString);
mongoose.connection.on("error", (error: Error) => console.log(error));
