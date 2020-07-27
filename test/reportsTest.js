// Set node evnironment as test.
process.env.NODE_ENV = 'test';

// Require models
const Report = require('../models/report');

// require all the dependencies for testing 
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
chai.use(chaiHttp);

// All the test for reports will go here
describe('Reports', () => {
    beforeEach((done) => {
        Report.remove({}, (err) => {
            done();
        });
    });

    describe('/GET reports/:status', () => {

        // Get all the reports of a particular Status
        it('it should GET all reports -> reports/:status', (done) => {
            chai.request(server)
                .get('/api/v1/reports/N')
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('reports');
                    res.body.data.reports.should.be.a('array');
                    res.body.data.reports.length.should.eql(0);
                    done();
                });
        });

        // Should throw error saying incorrect status
        it('it should throw an error saying cannot get reports because incorrect status : -> /reports/:status', (done) => {
            chai.request(server)
                .get('/api/v1/reports/L')
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Please enter the correct status");
                    done();
                });
        });
    });
});