process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Patient = require('../models/patient');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);

describe('Patients', () => {
    beforeEach((done) => {
        Patient.remove({}, (err) => {
            done();
        });
    });

    let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjFlMTA1YmI5YTQ3NmZjOTg4MmQwZTAiLCJuYW1lIjoiRHIuRG9jdG9yIiwidXNlcm5hbWUiOiJkb2MwMDciLCJwYXNzd29yZCI6ImRvY3RvciIsImNyZWF0ZWRBdCI6IjIwMjAtMDctMjZUMjM6MjM6MDcuNzA2WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDctMjZUMjM6MjM6MDcuNzA2WiIsIl9fdiI6MCwiaWF0IjoxNTk1ODA1ODI4LCJleHAiOjE1OTU5MDU4Mjh9.m238ISuXebPEbQtsK0qh-iKUMPP2Tl-_IlB-YphWYLo";


    // Register patients auhtorization failed
    describe('/GET patients/register', () => {
        let patient = {
            phone_number: 9999999999,
            name: "New Patient"
        }
        it('it should return an error with message saying not authorized to create patient as jwt not send -> REGISTER PATIENT', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(patient)
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
    });


    // Registration of Patient failed because of missing data field
    describe('/GET patients/register', () => {
        let patient = {
            phone_number: 9999999999,
        }
        it('it should return an error with message saying internal server error -> REGISTER PATIENT', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send(patient)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("Internal Server Error");
                    done();
                });
        });
    });

    // Register patients Success
    describe('/GET patients/register', () => {

        let patient = {
            name: "New Patient",
            phone_number: "9999999999"
        };

        it('it should create a patient -> REGISTER PATIENT', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send(patient)
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



    // Create report authorization failed
    describe('/GET patients/id/create_report', () => {
        let report = {
            status: "N"
        }
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
    });

    // Create report authorization send but patient id incorrect.
    describe('/GET patients/id/create_report', () => {
        let report = {
            status: "N"
        }
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
    });

    // Create report authorization send but patient id correct but status incorrect.
    describe('/GET patients/id/create_report', () => {

        it('it should throw error saying status incorrect -> create report', (done) => {

            let patient = new Patient({phone_number:"9999999999",name:"New patient"});
            patient.save((err,patient)=>{
                chai.request(server)
                .post('/api/v1/patients/'+patient.phone_number+'/create_report')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({status:"N"})
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
    });


    // Create report sucess
    describe('/GET patients/id/create_report', () => {

        it('it should create report -> create report', (done) => {

            let patient = new Patient({phone_number:"9999999999",name:"New patient"});

            patient.save((err,patient)=>{
                chai.request(server)
                .post('/api/v1/patients/'+patient.phone_number+'/create_report')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({status:"N"})
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



    // All reports patient id incorrect
    describe('/GET patients/id/all_reports', () => {
        it('it should return an error with message saying patient id incorrect', (done) => {
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
    });





});