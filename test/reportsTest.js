// process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
// let Report = require('../models/report');

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../index');
// let should = chai.should();


// chai.use(chaiHttp);

// describe('All Reports', () => {
//     beforeEach((done) => {
//         Report.remove({}, (err) => {
//             done();
//         });
//     });

//     describe('/GET All Reports', () => {
//         it('it should GET all reports', (done) => {
//             chai.request(server)
//                 .get('/api/v1/reports/N')
//                 .end((err, res) => {
//                     console.log(res.body);
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('data');
//                     res.body.data.should.be.a('object');
//                     res.body.data.should.have.property('reports');
//                     res.body.data.reports.should.be.a('array');
//                     res.body.data.reports.length.should.eql(0);
//                     done();
//                 });
//         });
//     });
// });