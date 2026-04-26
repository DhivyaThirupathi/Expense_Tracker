const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const connectDB = require("./src/db");
connectDB();

const expRoutes = require("./src/routes/expense");

app.use("/api/exp", expRoutes);

app.listen(5000, () => {
  console.log("running on 5000");
});