const expect = require('chai').expect
const {createToken, deleteToken, checkForActiveToken, getAssociatedUser} = require('../../db/models/token');
const { getUser, createNewUser, removeUserByUsername } = require('../../db/models/users');

let username = "TestTokenUser1";
let password = "Asdobo12ub"
let userId = 0;
before("Create User Object", () => {
    return createNewUser(username, password)
    .then(result => getUser(username))
    .then(result => userId = result.rows[0].id)
})
after("Removing user object", () => {
    return removeUserByUsername(username)
})
describe("#dbTokenQuery", () => {
    context('Creating token query', () => {
        let tokenValue = ''
        after("Removing created token", () => {
            return deleteToken(tokenValue)
        })
        it("Attempting to create token", () => {
            return createToken(userId)
                .then(token => {
                    expect(token).to.not.equal('')
                    tokenValue = token;
                })
        })
    })
    context('Deleting token', () => {
        let tokenValue = ''
        before("Creating token to remove for test case", () => {
            return createToken(userId)
                .then(token => tokenValue = token)
        })
        it("Attempting to delete token", () => {
            return deleteToken(tokenValue)
                .then(result => expect(result.rowCount).to.equal(1))
        })
    })
    context("Check for active token with userId", () => {
        let tokenValue = ''
        before("Creating a token to be found", () => {
            return createToken(userId)
        })
        after('Remove created token', () => {
            return deleteToken(tokenValue)
        })
        it('Finding active token', () => {
            return checkForActiveToken(userId)
                .then(returnQuery => {
                    expect(returnQuery.rowCount).to.not.equal(0);
                    tokenValue = returnQuery.rows[0].value;
                })
        })
    })
    context('Get associated user by token value', () => {
        let tokenValue = ''
        before("Create token to retrieved", () => {
            return createToken(userId)
                .then(token => tokenValue = token)
        })
        after("Remove created token", () => {
            return deleteToken(tokenValue)
        })
        it("Attempting to retrieve userId by token value", () => {
            return getAssociatedUser(tokenValue)
                .then(result => expect(result.rowCount).to.equal(1))
        })
    })
})