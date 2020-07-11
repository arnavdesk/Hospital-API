const express = require("express");
const app = express();
const port = 8000;

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