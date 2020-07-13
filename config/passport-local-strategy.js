const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const Doctor = require("../models/doctor");


// authentication with local strategy
passport.use(new localStrategy({
    usernameField: "username",
    passReqToCallback:true
},
    function (request,username, password, done) {
        // find a doctor and establish identity
        Doctor.findOne({ username: username }, function (err, doctor) {
            if (err) {
                console.log("error finding in user --> passport");
                request.info = "Something's not Right";
                request.code =500;
                return done(err);
            }
            if (!doctor || doctor.password != password) {
                console.log("Invalid username password");
                request.code =401;
                request.info = "Invalid username password";
                return done(null, false);
            }
            else {
                console.log(doctor);
                request.code = 200;
                return done(null, doctor);
            }
        });
    }

));


module.exports = passport;