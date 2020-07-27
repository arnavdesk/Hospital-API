const express = require("express");
const config = require("config");
const app = express();
let port = 8000;
if (config.util.getEnv("NODE_ENV") === "test") {
    port = 6000;
}

// read request
app.use(express.urlencoded());


// MongoDB
const db = require("./config/mongoose");


// passport
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require("./config/passport-jwt-strategy");


app.use(passport.initialize());


// Use express router
app.use("/", require("./routes"));


app.listen(port, function (err) {
    if (err) {
        console.log(`Error in firing up the server : ${err}`);
    }
    else {
        console.log(`server is running on ${port}`);
    }
})

module.exports = app;