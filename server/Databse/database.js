const mongoose = require("mongoose");


const Database = () => {
const MONGO_URL = process.env.DB_KEY;


  mongoose.connect(MONGO_URL);

  mongoose.connection.on("connected", () => {
    console.log("Database connectd 😀");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database Disconnected ");
  });

  mongoose.connection.on("error", (error) => {
    console.log(error);
  });
};

module.exports = { Database };
