const Patient = require("../../models/patient");
const Report = require("../../models/report");
const status = {
    N: "Negative",
    TQ: "Travelled-Quarantine",
    SQ: "Symptoms-Quarantine",
    PA: "Positive-Admit"
}

// Get all reports by status
module.exports.getReportsByStatus = async function (request, response) {
    let stats = request.params.status;

    try {
        stats = status[stats.toUpperCase()];
        if (!stats) {
            console.log("Error 1");
            return response.json(500, {
                status: 500,
                message: "Please enter the correct status"
            })
        }
        else {
            let reports = await Report.find({ status:stats }, "status createdAt doctor -_id")
            .sort("createdAt")
            .populate("doctor patient", "phone_number name -_id");
            
            return response.json(200, {
                status: 200,
                message: "All Reports with status : "+stats,
                data: {
                    reports: reports
                }
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