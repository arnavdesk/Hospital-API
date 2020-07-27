const mongoose = require("mongoose");
const config = require("config");

if (config.util.getEnv("NODE_ENV") !== "test") {
    mongoose.connect("mongodb://localhost/Hospita_db_development");
}
else {
    mongoose.connect("mongodb://localhost/Hospita_db_test");
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error Connecting Database"));


db.once("open", function () {
    console.log("Connected to Database :: MongoDB");
})


module.exports = db;


