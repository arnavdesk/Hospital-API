// require mongoose
const mongoose = require("mongoose");

// create schema

const patientSchema = mongoose.Schema({
    phone_number: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    reports:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Report"
    }]
}, {
    timestamps: true
})


const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;