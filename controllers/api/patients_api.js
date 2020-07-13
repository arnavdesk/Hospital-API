const Patient = require("../../models/patient");
const Report = require("../../models/report");
const status = {
    N: "Negative",
    TQ: "Travelled-Quarantine",
    SQ: "Symptoms-Quarantine",
    PA: "Positive-Admit"
}

// Create a patient record getting phone number and 
// name only after authentication if patient already exist return patient
module.exports.create = async function (request, response) {
    try {
        let patient = await Patient.findOne({ phone_number: request.body.phone_number }, "name phone_number");
        if (!patient) {
            let patient = await Patient.create(request.body);
            console.log("Patient Created Hurrah!");
            return response.json(200, {
                status: 200,
                message: "Registration Success, Patient Registered! Your Mobile Number is id for now!!!",
                data: {
                    patient: { name: patient.name, phone_number: patient.phone_number },
                }
            })
        } else {
            console.log("Patient already exists")
            return response.json(409, {
                status: 409,
                message: "Patient already exists",
                data: {
                    patient: { name: patient.name, phone_number: patient.phone_number },
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        return response.json(500, {
            message: "Internal Server Error"
        })
    }
}



// create a report for a patient by getting status.
module.exports.createReport = async function (request, response) {
    const patient_id = request.params.id;
    try {
        let patient = await Patient.findOne({ phone_number: patient_id });
        if (patient) {
            request.body.patient = patient._id;
            request.body.doctor = request.user._id;
            request.body.status = status[request.body.status.toUpperCase()];
            if (!request.body.status) {
                console.log("Error 1");
                return response.json(500, {
                    status: 500,
                    message: "Please enter the correct status"
                })
            }
            let report = await (await Report.create(request.body)).populate('doctor patient','name phone_number -_id').execPopulate();
            if (report) {
                console.log(report);
                patient.reports.push(report._id);
                patient.save();
                return response.json(200, {
                    status: 200,
                    message: "Report Generation Sucess!",
                    data: {
                        report: report
                    }
                })
            }
            else {
                console.log("Error 2");
                return response.json(500, {
                    status: 500,
                    message: "Internal Server Error"
                })
            }
        } else {
            return response.json(500, {
                status: 500,
                message: "Patient ID incorrect"
            })
        }
    } catch (error) {
        console.log("Error 3");
        console.log(error);
        return response.json(500, {
            status: 500,
            message: "Internal Server Error"
        })
    }

}

// generate all reports of a particular user by getting id
module.exports.allReports = async function (request, response) {
    const patient_id = request.params.id;
    try {
        let patient = await Patient.findOne({ phone_number: patient_id });
        if (patient) {
            let reports = await Report.find({ patient: patient._id }, "status createdAt doctor -_id")
                .sort("createdAt")
                .populate("doctor", "name -_id");

            
            return response.json(200, {
                status: 200,
                message: "All Reports",
                data: {
                    patient: { name: patient.name, phone_number: patient.phone_number },
                    reports: reports
                }
            })

        }
        else {
            return response.json(500, {
                status: 500,
                message: "Patient ID incorrect"
            })
        }
    }
    catch (error) {
        return response.json(500, {
            status: 500,
            message: "Internal Server Error!"
        });
    }
}