const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const Doctor = require("../models/doctor");


let opts = {
    jwtFromRequest : extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : "codeial"
}

passport.use(new jwtStrategy(opts, function(jwtPayload, done){
    Doctor.findById(jwtPayload._id, function(err, doctor){
        if(err){
            console.log("Error in finding Doctor -> JWT");
        }
        else{
            if(doctor){
                return done(null, doctor);
            }else{
                return done(null, flase);
            }
        }
    })
}));

module.exports = passport;