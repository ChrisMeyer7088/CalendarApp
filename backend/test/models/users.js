process.env.NODE_ENV = 'test'
const expect = require("chai").expect;
var { createNewUser, checkUserCredentials, removeUserByUsername } = require("../../db/models/users");
require('../_setup')

let counter = 0;

describe("#dbuserQuery", () => {
    context("Creates a valid User Object in the db", () => {
        let username = "TestUsersUser1";
        let password = "Asdy12sua";
        const email = `chris${++counter}@gmail.com`
        it("Adds a valid user to the database", () => {
            return createNewUser(username, password, email)
                .then(result => {
                    expect(result.rowCount).to.equal(1)
                })
        })
    })
    context("Removes a valid User Object", () => {
        let username = "TestUser2";
        let password = "Asdy12sua";
        const email = `chris${++counter}@gmail.com`
        before("Adds the mock user to database", () => {
            return createNewUser(username, password, email)
        })
        it("Removes a valid user from the database", () => {
            return removeUserByUsername(username)
                .then(result => {
                    expect(result.rowCount).to.equal(1)
                })
        })
    })
    context("User Credential Authorization", () => {
        let username = "TestUser3";
        let password = "Asdy12sua";
        const email = `chris${++counter}@gmail.com`
        before("Adds the mock user to database", () => {
            return createNewUser(username, password, email)
        })
        it("Verifies the user credentials", () => {
            return checkUserCredentials(username, password)
                .then(userId => {
                    expect(userId).to.be.ok;
                })
        })
    })
    context("Failed User Creation", () => {
        let username = "";
        let password = 123;
        const email = `chris${++counter}@gmail.com`
        it("Fails adding user to database", () => {
            return createNewUser(username, password, email)
                .catch(err => {
                    expect(() => {throw err}).to.throw(Error)
                })
        })
    })
    context("Failed to authorize Credentials", () => {
        let username = "TestUser4";
        let password = "Asdy12sua";
        const email = `chris${++counter}@gmail.com`
        before("Adds the mock user to database", () => {
            return createNewUser(username, password, email)
        })
        it("Attempts to verify incorrect credentials", () => {
            return checkUserCredentials(username, "password")
                .then(isAuthorized => { 
                   expect(isAuthorized).to.be.false
                })
        })
    })
    context("Failed to remove invalid username", () => {
        let username = "InvalidUser";
        it("Attempts to remove nonexisting username", () => {
            return removeUserByUsername(username)
                .then(result => {
                    expect(result.rowCount).to.equal(0)
                })
        })
    })
    context("Catching checkUserCredentials error", () => {
        let username = "";
        let password = "Asdy12sua";
        it("Attempts to verify incomplete credentials", () => {
            return checkUserCredentials(username, password)
            .catch(err => {
                expect(() => { throw err }).to.throw(Error, "Username cannot be empty");
            })
        })
    })
})