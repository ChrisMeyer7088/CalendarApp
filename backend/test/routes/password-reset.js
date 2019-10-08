process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const server = require('../../index');
require('../_setup')
const { createResetLink, getActiveResetLink, checkLinkValue, resetPassword } = require('../../db/models/resetLink');
const { createNewUser, getUserByUsername } = require('../../db/models/users')


chai.use(chaiHTTP)
;
let username = "ITResetLinkUser1";
let password = "Asdobo12ub";
let email = "resetLinkITEmail@gmail.com"
let userId = 0;
before("Create user", () => {
    return createNewUser(username, password, email)
    .then(result => getUserByUsername(username))
    .then(result => userId = result.rows[0].id)
})
describe('#routesPassword-Reset', () => {
    context('POST /password-reset/email', () => {
        it("Should not find email in db", () => {
            let data = {email: "test@gmail.com"}
            chai.request(server)
            .post('/password-reset/email')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body.data.message).to.equal('Email does not exist')
                expect(res.body.success).to.be.true;
            })
        })
        it("Should send a successful email", () => {
            let data = {email: email}
            chai.request(server)
            .post('/password-reset/email')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body.data.message).to.equal('Link Sent')
                expect(res.body.success).to.be.true;
            })
        })
        it("Should respond with bad request", () => {
            let data = {}
            chai.request(server)
            .post('/password-reset/email')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body.data.message).to.equal('The parameter email is required')
                expect(res.body.success).to.be.false;
            })
        })
    })
    context('POST /password-reset/verify-link', () => {
        let resetLinkValue = ''
        before("create reset link value", () => {
            return createResetLink(userId) 
            .then(result => getActiveResetLink(userId))
            .then(result => {
                resetLinkValue = result.rows[0].value
            })
        })
        it("Should verify that the link is valid", () => {
            let data = {value: resetLinkValue};
            chai.request(server)
            .post('/password-reset/verify-link')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body.data.message).to.equal('Verification Successful')
                expect(res.body.success).to.be.true;
            })
        })
        it("Should say link value is invalid", () => {
            let data = {value: "value"}
            chai.request(server)
            .post('/password-reset/verify-link')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body.data.message).to.equal('Bad Link Value')
                expect(res.body.success).to.be.false;
            })
        })
        it("Should respond with bad request", () => {
            let data = {}
            chai.request(server)
            .post('/password-reset/verify-link')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body.data.message).to.equal('The parameter value is required')
                expect(res.body.success).to.be.false;
            })
        })
    })
    context("PUT /password-reset/password", () => {
        let resetLinkValue = ''
        before("create reset link value", () => {
            return createResetLink(userId) 
            .then(result => getActiveResetLink(userId))
            .then(result => {
                resetLinkValue = result.rows[0].value
            })
        })
        it("Should successfully update password", () => {
            let data = {value: resetLinkValue, password: "!QWEasdweq21"}
            chai.request(server)
            .put('/password-reset/password')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body.data.message).to.equal('Password successfully updated')
                expect(res.body.success).to.be.true;
            })
        })
        it("Should fail from missing body parameters", () => {
            let data = {value: resetLinkValue}
            chai.request(server)
            .put('/password-reset/password')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body.data.message).to.equal('The body parameter value or password is missing')
                expect(res.body.success).to.be.false;
            })
        })
        it("Should fail from invalid password", () => {
            let data = {value: resetLinkValue, password: "invalid"}
            chai.request(server)
            .put('/password-reset/password')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body.data.message).to.equal('Invalid password submitted')
                expect(res.body.success).to.be.false;
            })
        })
        it("Should fail from invalid link value", () => {
            let data = {value: "invalidLink", password: "!QWEasdweq21"}
            chai.request(server)
            .put('/password-reset/password')
            .send(data)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body.data.message).to.equal('Invalid link value')
                expect(res.body.success).to.be.false;
            })
        })
    })
})