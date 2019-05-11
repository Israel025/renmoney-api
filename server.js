const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute");
const LoanRoute = require("./routes/LoanRoute");
const env = require("./env");
const port = env.port;
const app = express();

app.use(cors());

mongoose
  .connect(env.mongodb_url, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch(err => {
    console.log("DB connection failed!", err);
  });

app.use((req, res, next) => {
  console.log(`$[${new Date().toTimeString()}]: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/user", UserRoute);

//app.use("/leave", LeaveRequestRoute);

app.listen(port).on("listening", () => {
  console.log(`Server running on ${port}`);
});
