process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Doctor = require('../models/doctor');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);

describe('Doctor', () => {
    beforeEach((done) => {
        Doctor.remove({}, (err) => {
            done();
        });
    });

    describe('/doctor/register', () => {
        const doctorIncorrect = { username: "DummyDoc", password: "dummyPass", "confirm-password": "dummyPass" }

        const doctorWrongConfirmPass = { name: "Dr. Dummy", username: "DummyDoc", password: "dummyPass", "confirm-password": "dummyPass123" }

        const doctorCorrect = { name: "Dr. Dummy", username: "DummyDoc", password: "dummyPass", "confirm-password": "dummyPass" }

        // registration of doctor with missing field Should throw error of missing field
        it('it should say incorrect internal server error because missing field -> register doctor', (done) => {
            chai.request(server)
                .post('/api/v1/doctor/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(doctorIncorrect)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Internal Server Error");
                    res.body.status.should.be.eql(500);
                    done();
                });
        });

        // registration of doctor with incorrect confirm password Should throw error.
        it('it should say password and confirm password not equal -> register doctor', (done) => {
            chai.request(server)
                .post('/api/v1/doctor/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(doctorWrongConfirmPass)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(422);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Password and confirm-password not equal");
                    res.body.status.should.be.eql(422);
                    done();
                });
        });

        // registration of doctor with incorrect confirm password Should throw error.
        it('it should say doctor registerd -> register doctor', (done) => {
            chai.request(server)
                .post('/api/v1/doctor/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(doctorCorrect)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.should.have.property("data");
                    res.body.message.should.be.eql("Registration Success");
                    res.body.status.should.be.eql(200);
                    res.body.data.should.have.property("doctor");
                    res.body.data.doctor.should.have.property("name");
                    res.body.data.doctor.should.have.property("username");
                    done();
                });
        });

    });


    // All tests for login route
    describe('/doctor/login', () => {
        const doctorIncorrect = {username: "DummyDoc", password: "dummyPass"}
        const doctorWrongConfirmPass = { username: "DummyDoc", password: "dummyPass"}
        const doctorCorrect = { username: "DummyDoc", password: "dummyPass"}

        // unable to login because of wrong username
        it('it should say authorization failed because wrong doctor username -> login doctor', (done) => {
            Doctor.create({username: "TestDoc", password: "TestPass",name:"Dr. Test", "confirm-password":"TestPass"},(err,doctor)=>{
                chai.request(server)
                .post('/api/v1/doctor/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({username:"TestDoc2",password:"TestPass"})
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Authorization failed! Invalid Authorization key or Password or Username!!");
                    res.body.status.should.be.eql(401);
                    done();
                });
            })
            
        });


        // unable to login because of wrong password
        it('it should say authorization failed because wrong doctor password -> login doctor', (done) => {
            Doctor.create({username: "TestDoc", password: "TestPass",name:"Dr. Test", "confirm-password":"TestPass"},(err,doctor)=>{
                chai.request(server)
                .post('/api/v1/doctor/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({username:"TestDoc",password:"TestPass2"})
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Authorization failed! Invalid Authorization key or Password or Username!!");
                    res.body.status.should.be.eql(401);
                    done();
                });
            })
            
        });


        // Should be able to log in with correct credentials
        it('it should login doctor and send jwt token -> login doctor', (done) => {
            Doctor.create({username: "TestDoc", password: "TestPass",name:"Dr. Test", "confirm-password":"TestPass"},(err,doctor)=>{
                chai.request(server)
                .post('/api/v1/doctor/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({username:doctor.username,password:doctor.password})
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Sign in sucessful take the token and keep it safe");
                    res.body.status.should.be.eql(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("token");
                    done();
                });
            })
            
        });


    });

});