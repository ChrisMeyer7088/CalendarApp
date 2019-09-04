const assert = require('assert');
var { createNewUser,
    getUser,
    checkUserCredentials,
    getUsers,
    removeUser } = require("../db/models/users");

let testUsers = []

describe("Users database access functions", () => {
    //If query resolved successful test passed otherwise test failed
    describe("Create user method", () => {
        it("Adds a valid user to the database", () => {
            let username = "TestUserAlpha";
            let password = "Asdy12sua";
            testUsers.push(username);
            createNewUser(username, password)
                .then(result => {
                    assert(true);
                })
                .catch(err => {
                    assert(false);
                })
        })
    })
    describe("User Deletion method", () => {
        it("Removes an existing user", () => {
            testUsers.forEach(username => {
                removeUser(username)
                    .then(result => {
                        assert(true);
                    })
                    .catch(err => {
                        assert(false);
                    })
            })
        })
    })
})