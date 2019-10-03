process.env.NODE_ENV = 'test'
const expect = require('chai').expect
const {createToken, deleteToken, checkForActiveToken, getAssociatedUser} = require('../../db/models/token');
const { getUserByUsername, createNewUser, removeUserByUsername } = require('../../db/models/users');
require('../_setup')


let username = "TestTokenUser1";
let password = "Asdobo12ub"
let email = "tokenEmail@gmail.com"
let userId = 0;
before("Clear DB and create user", () => {
    return createNewUser(username, password, email)
    .then(result => getUserByUsername(username))
    .then(result => userId = result.rows[0].id)
})
describe("#dbTokenQuery", () => {
    context('Creating token query', () => {
        it("Attempting to create token", () => {
            return createToken(userId)
                .then(tokenValue => {
                    expect(tokenValue).to.not.equal('')
                })
        })
    })
    context('Deleting token', () => {
        let tokenValue = ''
        before("Creating token to remove for test case", () => {
            return createToken(userId)
                .then(token => {
                    tokenValue = token
                })
        })
        it("Attempting to delete token", () => {
            return deleteToken(tokenValue)
                .then(result => expect(result.rowCount).to.equal(1))
        })
    })
    context("Check for active token with userId", () => {
        before("Creating a token to be found", () => {
            return createToken(userId)
        })
        it('Finding active token', () => {
            return checkForActiveToken(userId)
                .then(returnQuery => {
                    expect(returnQuery.rowCount).to.not.equal(0);
                })
        })
    })
    context('Get associated user by token value', () => {
        let tokenValue = ''
        before("Create token to retrieved", () => {
            return createToken(userId)
                .then(token => tokenValue = token)
        })
        it("Attempting to retrieve userId by token value", () => {
            return getAssociatedUser(tokenValue)
                .then(result => expect(result.rowCount).to.equal(1))
        })
    })
})