process.env.NODE_ENV = 'test'
const expect = require("chai").expect;
const { createResetLink, getActiveResetLink, checkLinkValue, resetPassword } = require('../../db/models/resetLink');
const { createNewUser, getUserByUsername } = require('../../db/models/users')

let username = "TestResetLinkUser1";
let password = "Asdobo12ub";
let email = "resetLinkEmail@gmail.com"
let userId = 0;
before("Create user", () => {
    return createNewUser(username, password, email)
    .then(result => getUserByUsername(username))
    .then(result => userId = result.rows[0].id)
})
describe('#dbResetLinksQueries', () => {
    context('Create resetLink', () => {
        it('Should create a successful reset link', () => {
            return createResetLink(userId)
            .then(result => {
                expect(result.rowCount).to.equal(1)
            })
        })
        it('Should fail at creating a reset link for a false userId', () => {
            return createResetLink(userId)
            .catch(result => {
                expect(result).to.not.be.false;
            })
        })
    })
    context('Get Active Reset Link', () => {
        it('Should retrieve a valid reset link', () => {
            return createResetLink(userId) 
            .then(getActiveResetLink(userId))
            .then(result => {
                expect(result.rowCount).to.not.equal(0)
            })
        })
        it("Should not be able to find a userId that doesn't exist", () => {
            return getActiveResetLink(100000000)
            .then(result => {
                expect(result.rowCount).to.equal(0)
            })
        })
    })
    context("Get User by link value", () => {
        let resetLinkValue = ''
        before("create reset link value", () => {
            return createResetLink(userId) 
            .then(result => getActiveResetLink(userId))
            .then(result => {
                resetLinkValue = result.rows[0].value
            })
        })
        it("Should retrieve user email from reset link value", () => {
            return checkLinkValue(resetLinkValue)
                .then(result => {
                    expect(result.rows[0].email).to.equal(email)
                })
        })
        it("Should throw an error from invalid value", () => {
            return checkLinkValue(false)
                .catch(err => {
                    expect(err).to.not.be.false;
                })
        })
    })
    context("Reset User password", () => {
        let resetLinkValue = ''
        before("create reset link value", () => {
            return createResetLink(userId) 
            .then(result => getActiveResetLink(userId))
            .then(result => {
                resetLinkValue = result.rows[0].value
            })
        })
        it("Should successfully update user password", () => {
            let password = "1234Q@asd";
            return resetPassword(resetLinkValue, password)
            .then(result => {
                expect(result.rowCount).to.equal(1)
            })
        })
        it("Should unsuccessfully update user password", () => {
            return resetPassword("InvalidLinkValue", password)
            .then(result => {
                expect(result.rowCount).to.equal(0)
            })
        })
        it("Should throw an error from invalid type", () => {
            return resetPassword(false, password)
            .catch(result => {
                expect(result).to.not.equal.false;
            })
        })
    })
})