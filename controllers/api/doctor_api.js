const Doctor = require("../../models/doctor");
const jwt = require("jsonwebtoken");



//  Create a record for doctor in db by taking password, confirm password, username and name.
module.exports.create = async function (request, response) {
    console.log(request.body);
    if (request.body["password"] != request.body["confirm-password"]) {
        console.log("password and confirm password not equal!");
        return response.json(422, {
            status : 422,
            message: "Password and confirm-password not equal"
        });
    }

    try {
        let doctor = await Doctor.findOne({ username: request.body.username });
        if (!doctor) {
            let doctor = await Doctor.create(request.body);
            console.log("Doctor Created Hurrah!");
            return response.json(200, {
                status : 200,
                message: "Registration Success",
                data: {
                    doctor: {_id:doctor.id,name:doctor.name,username:doctor.username}
                }
            })
        } else {
            console.log("User already exists")
            return response.json(409, {
                status : 409,
                message: "User already exists",
            })
        }
    }
    catch (err) {
        console.log(err);
        return response.json(500, {
            status : 500,
            message: "Internal Server Error"
        })
    }

}


// Login with username and password of doctor, generate jwt token for doctor and return in json.
module.exports.generateKey = function  (request, response) {
    if (request.user) {
        return response.json(200, {
            status :request.code,
            message: "Sign in sucessful take the token and keep it safe",
            data: {
                token: jwt.sign(request.user.toJSON(), "codeial", { expiresIn: 100000 })
            }
        })
    } else {
        return response.json(500, {
            status :request.code,
            message: "Something's Not right"
        });
    }
}