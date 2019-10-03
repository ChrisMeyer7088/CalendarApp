process.env.NODE_ENV = 'test'
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const server = require('../../index');
require('../_setup')

chai.use(chaiHTTP);

describe("#routesInfo", () => {
    context("GET /info/notices", () => {
        let tokenValue = ''
        before("Register and login a user and retireve the notices", () => {
            let data = {
                username: "AuthUser1",
                password: "Asdus72Ds",
                email: "noticeIT@gmail.com"
            }
            return chai.request(server)
                .post('/user/register')
                .send(data)
                .then(res => {
                    return chai.request(server)
                        .post('/user/login')
                        .send(data)
                })
                .then(res => tokenValue = res.body.data.token)
        })
        it("Should return Notices Retrieved", () => {
            chai.request(server)
                .get('/info/notices')
                .set('Authorization', tokenValue)
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.message).to.equal('Notices Retrieved')
                    expect(res.body.data.notices).to.be.an('array')
                })
        })
        it("Should return Invalid Token", () => {
            chai.request(server)
                .get('/info/notices')
                .set('Authorization', "InvalidToken")
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.message).to.equal('Invalid Token')
                    expect(res.body.data.returnToLogin).to.equal(true)
                })
        })
        it("Should return Request must have a valid token", () => {
            chai.request(server)
                .get('/info/notices')
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body.data.message).to.equal('Request must have a valid token')
                })
        })
    })
})