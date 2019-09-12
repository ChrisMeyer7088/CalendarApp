process.env.NODE_ENV = 'test'
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const server = require('../../index');
require('../_setup')

chai.use(chaiHTTP);

describe('#routesUser', () => {
    context("POST /user/register", () => {
        it("Should add a new user", () => {
            let data = {
                username: "RouteUser1",
                password: "Aasjkhvasf5"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .end((err, res) => {
                    expect(res.body.success).to.be.true;
                    expect(res.status).to.equal(200);
                })
        })
        it("Should fail to add a new user", () => {
            let data = {
                username: "RouteUser2"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                })
        })
        it("Should fail to register", () => {
            let data = {
                username: "RouteUser3",
                password: "password"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                })
        })
        it("Should fail to register a duplicate username", () => {
            let data = {
                username: "RouteUser6",
                password: "Aasjkhvasf5"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .then(res => {
                    expect(res.status).to.equal(200);
                    return chai.request(server)
                        .post('/user/register')
                        .send(data)
                })
                .then(res => {
                    expect(res.status).to.equal(400);
                })
        })
    })
    context("POST /user/user", () => {
        it("Should say username does not exist", () => {
            let data = {
                username: "RouteUser4"
            }
            chai.request(server)
                .post('/user/user')
                .send(data)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.userExists).to.be.false;
                })
        })
        it("Should say username exists", () => {
            let data = {
                username: "RouteUser5"
            }
            chai.request(server)
                .post('/user/register')
                .send({username: data.username, password: "123!@#asdASD"})
                .then(() => {
                    chai.request(server)
                    .post('/user/user')
                    .send(data)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.success).to.be.true;
                        expect(res.body.data.userExists).to.be.true;
                    })
                })
        })
        it("Should say bad request", () => {
            chai.request(server)
                .post('/user/user')
                .send({})
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                })
        })
    })
    context("POST /user/login", () => {
        it("Should succed in login", () => {
            let data = {
                username: "RouteUser8",
                password: "ASDasdi12ns"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .then(res => {
                    expect(res.status).to.equal(200);
                    return chai.request(server)
                        .post('/user/login')
                        .send(data)
                })
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.loggedIn).to.be.true;
                })
        })
        it("Should fail in login with invalid password", () => {
            let data = {
                username: "RouteUser9",
                password: "ASDasdi12ns"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .then(res => {
                    expect(res.status).to.equal(200);                    
                    return chai.request(server)
                        .post('/user/login')
                        .send({username: data.username, password: "password"})
                })
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.loggedIn).to.be.false;
                })
        })
        it("Should fail in login with invalid username", () => {
            let data = {
                username: "RouteUser10",
                password: "ASDasdi12ns"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .then(res => {
                    expect(res.status).to.equal(200);                    
                    return chai.request(server)
                        .post('/user/login')
                        .send({username: "InvalidUserrrr", password: data.password})
                })
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.data.loggedIn).to.be.false;
                })
        })
        it("Should fail with invalid request body", () => {
            let data = {
                username: "RouteUser10"
            }
            chai.request(server)
                .post('/user/register')
                .send(data)
                .then(res => {
                    return chai.request(server)
                        .post('/user/login')
                        .send({username: "InvalidUserrrr"})
                })
                .then(res => {
                    expect(res.status).to.equal(400);                  
                })
        })
    })
})