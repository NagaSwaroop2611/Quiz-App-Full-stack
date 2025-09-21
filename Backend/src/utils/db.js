const mongoose = require("mongoose");
require("dotenv").config();

const db = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected 😊..."))
    .catch(() => console.log("Error connecting in MongoDB ❌"))
};

module.exports = db;