process.env.NODE_ENV = 'test'
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const server = require('../../index');
require('../_setup')

chai.use(chaiHTTP);

describe("#routesInfo", () => {
    context("POST /info/auth", () => {
        let tokenValue = ''
        before("Register and login a user and retireve the token", () => {
            let data = {
                username: "AuthUser1",
                password: "Asdus72Ds"
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
        it("Should return Authentication Successful", () => {
            chai.request(server)
                .post('/info/auth')
                .send({token: tokenValue})
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.message).to.equal('Authentication Successful')
                })
        })
        it("Should return Invalid Token", () => {
            chai.request(server)
                .post('/info/auth')
                .send({token: "Invalid Token"})
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.message).to.equal('Invalid Token')                    
                })
        })
        it("Should return a status code of 400", () => {
            chai.request(server)
                .post('/info/auth')
                .send({})
                .then(res => {
                    expect(res.status).to.equal(400);
                })
        })
    })
})