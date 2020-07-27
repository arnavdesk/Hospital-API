// Set node evnironment as test.
process.env.NODE_ENV = 'test';

// Require models
const Patient = require('../models/patient');
const Doctor = require("../models/doctor");
const Report = require('../models/report');

// require all the dependencies for testing 
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const jwt = require("jsonwebtoken");

const should = chai.should();
chai.use(chaiHttp);


// Test for all the patients will come under this.
describe('Patients', () => {
    let authToken = "";
    let doctor = "";

    // Empty all the collections and add a dummy doctor to generate jwt
    beforeEach((done) => {
        Patient.remove({}, (err) => {
        });
        Report.remove({}, (err) => {
        });
        Doctor.remove({}, (err) => {
            doctor = new Doctor({ name: "Dr. Dummy", username: "DummyDoc", password: "dummyPass", "confirm-password": "dummyPass" });
            doctor.save((err, doctor) => {
                authToken = jwt.sign(doctor.toJSON(), "codeial", { expiresIn: 100000 })
                done();
            })
        });
    });



    // Test patients/register route
    describe('/POST patients/register', () => {
        let patientIncorrect = {
            phone_number: 9999999999,
        }

        let patientCorrect = {
            name: "New Patient",
            phone_number: "9999999999"
        };

        // Register patients auhtorization failed
        it('it should return an error with message saying not authorized to create patient as jwt not send -> REGISTER PATIENT', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(patientCorrect)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message');
                    res.body.status.should.be.eql(401);
                    res.body.message.should.be.eql("Authorization failed! Invalid Authorization key or Password or Username!!");
                    done();
                });
        });

        // Registration of Patient failed because of missing data field.
        it('it should return an error with message saying internal server error because of missing data field  -> REGISTER PATIENT', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send(patientIncorrect)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("Internal Server Error");
                    done();
                });
        });

        // Register patients Success
        it('it should create a patient -> REGISTER PATIENT', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send(patientCorrect)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('status');
                    res.body.should.have.property('message');
                    res.body.status.should.be.eql(200);
                    res.body.message.should.be.eql('Registration Success, Patient Registered! Your Mobile Number is id for now!!!');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('patient');
                    res.body.data.patient.should.have.property('name');
                    res.body.data.patient.should.have.property('phone_number');
                    done();
                });
        });
    });






    // Test patients/id/create_report route
    describe('/POST patients/:id/create_report', () => {
        let report = {
            status: "N"
        }

        // Create report authorization failed
        it('it should return an error with message saying not authorized TO GENERATE REPORT bcz jwt not provided -> create report', (done) => {
            chai.request(server)
                .post('/api/v1/patients/21232/create_report')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(report)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message');
                    res.body.status.should.be.eql(401);
                    res.body.message.should.be.eql("Authorization failed! Invalid Authorization key or Password or Username!!");
                    done();
                });
        });

        // Create report authorization send but patient id incorrect.
        it('it should return an error with message saying patient id incorrect -> create report', (done) => {
            chai.request(server)
                .post('/api/v1/patients/45353/create_report')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send(report)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message');
                    res.body.status.should.be.eql(500);
                    res.body.message.should.be.eql("Patient ID incorrect");
                    done();
                });
        });

        // Create report and authorization send and patient id correct but status incorrect.
        it('it should throw error saying status incorrect -> create report', (done) => {

            let patient = new Patient({ phone_number: "9999999999", name: "New patient" });
            patient.save((err, patient) => {
                chai.request(server)
                    .post('/api/v1/patients/' + patient.phone_number + '/create_report')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set({ "Authorization": `Bearer ${authToken}` })
                    .send({ status: "L" })
                    .end((err, res) => {
                        // console.log(res.body);
                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status');
                        res.body.should.have.property('message');
                        res.body.status.should.be.eql(500);
                        res.body.message.should.be.eql("Please enter the correct status");
                        done();
                    });
            });

        });

        // Create report sucess
        it('it should create report -> create report', (done) => {

            let patient = new Patient({ phone_number: "9999999999", name: "New patient" });

            patient.save((err, patient) => {
                chai.request(server)
                    .post('/api/v1/patients/' + patient.phone_number + '/create_report')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set({ "Authorization": `Bearer ${authToken}` })
                    .send({ status: "N" })
                    .end((err, res) => {
                        // console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.should.have.property('message');
                        res.body.status.should.be.eql(200);
                        res.body.message.should.be.eql('Report Generation Sucess!');
                        res.body.should.have.property('data');
                        res.body.data.should.be.a('object')
                        res.body.data.should.have.property('report');
                        res.body.data.report.should.be.a('object')
                        res.body.data.report.should.have.property('patient');
                        res.body.data.report.should.have.property('doctor');
                        res.body.data.report.should.have.property('status');
                        res.body.data.report.status.should.be.eql("Negative")
                        res.body.data.report.doctor.should.have.property('name');
                        res.body.data.report.patient.should.have.property('name');
                        res.body.data.report.patient.should.have.property('phone_number');
                        done();
                    });
            });

        });


    });



    // TEST patients/id/all_reports
    describe('/GET patients/id/all_reports', () => {

        // All reports patient id incorrect
        it('it should return an error with message saying patient id incorrect -> ALL REPORTS', (done) => {
            chai.request(server)
                .get('/api/v1/patients/213213/all_reports')
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('message');
                    res.body.status.should.be.eql(500);
                    res.body.message.should.be.eql("Patient ID incorrect");
                    done();
                });
        });

        // All reports patient id correct
        it('it should send all reports of new patient -> ALL REPORTS', (done) => {
            let patient = new Patient({ phone_number: "9999999999", name: "New patient" });

            patient.save((err, patient) => {
                chai.request(server)
                    .get('/api/v1/patients/' + patient.phone_number + '/all_reports')
                    .end((err, res) => {
                        // console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.should.have.property('message');
                        res.body.should.have.property('data');
                        res.body.status.should.be.eql(200);
                        res.body.message.should.be.eql("All Reports");
                        res.body.data.should.have.property("patient");
                        res.body.data.should.have.property("reports");
                        res.body.data.reports.should.be.a("array");
                        res.body.data.patient.should.have.property("name");
                        res.body.data.patient.should.have.property("phone_number");
                        res.body.data.reports.should.be.a("array");
                        res.body.data.reports.length.should.be.eql(0);
                        done();
                    });
            });
        });

        // Get all reports including a new report created.
        it('it should send all reports of new patient which should contain 1 newly created report -> ALL REPORTS', (done) => {
            let patient = new Patient({ phone_number: "9999999999", name: "New patient" });

            patient.save((err, patient) => {
                let report = new Report({ doctor: doctor._id, patient: patient._id, status: "Negative" });
                report.save((err, report) => {
                    console.log(report);
                    patient.reports.push(report._id);
                    chai.request(server)
                        .get('/api/v1/patients/' + patient.phone_number + '/all_reports')
                        .end((err, res) => {
                            // console.log(res.body);
                            res.should.have.status(200);
                            res.body.should.have.property('status');
                            res.body.should.have.property('message');
                            res.body.should.have.property('data');
                            res.body.status.should.be.eql(200);
                            res.body.message.should.be.eql("All Reports");
                            res.body.data.should.have.property("patient");
                            res.body.data.should.have.property("reports");
                            res.body.data.reports.should.be.a("array");
                            res.body.data.patient.should.have.property("name");
                            res.body.data.patient.should.have.property("phone_number");
                            res.body.data.reports.should.be.a("array");
                            res.body.data.reports.length.should.be.eql(1);
                            res.body.data.reports[0].should.have.property("doctor");
                            res.body.data.reports[0].should.have.property("status");
                            res.body.data.reports[0].status.should.be.eql("Negative");
                            res.body.data.reports[0].should.have.property("createdAt");
                            done();
                        });
                })
            });
        });

    });

});