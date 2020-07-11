const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const Doctor = require("../models/doctor");

passport.use(new localStrategy({
    usernameField: "username",
    passReqToCallback:true
},
    function (request,email, password, done) {
        // find a doctor and establish identity
        Doctor.findOne({ username: username }, function (err, doctor) {
            if (err) {
                console.log("error finding in user --> passport");
                return done(err);
            }
            if (!doctor || doctor.password != password) {
                console.log("Invalid username password");
                request.flash("error","Invalid Username or Password!");
                return done(null, false);
            }
            else {
                console.log(doctor);
                return done(null, doctor);
            }
        });
    }

));


module.exports = passport;