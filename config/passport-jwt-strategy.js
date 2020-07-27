const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const Doctor = require("../models/doctor");
const { request } = require("express");



// extract token from header
let opts = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "codeial"
}


// authenticate using jwt 
passport.use(new jwtStrategy(opts, function (jwtPayload, done) {

    Doctor.findById(jwtPayload._id,"username name", function (err, doctor) {
        if (err) {
            request.code = 500;
            request.message = "Internal Server Error!!!"
            console.log("Error in finding Doctor -> JWT");
            return (err);
        }
        else {
            if (doctor) {
                return done(null, doctor);
            } else {
                request.code = 401;
                request.info = "Authorization failed! Invalid Authorization key or Doctor Doesn't exits!!"
                return done(null, false);
            }
        }
    })
}));

module.exports = passport;