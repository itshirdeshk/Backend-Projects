const mongoose = require("mongoose");
require("dotenv").config();

// define the mongoDB connection URL
const mongoUrl = process.env.MONGODB_URL;

// Set up mongoDB Connection
mongoose.connect(mongoUrl);

// Get the default connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on("connected", () => {
    console.log("Connected to MongoDB Server!");
});

db.on("error", (error) => {
    console.log("MongoDB Connection Error:", error);
});

db.on("disconnected", () => {
    console.log("MongoDB Dissconnected!");
});
module.exports = db;
