const {createNewUser} = require('../models/users')

function createMockUsers() {
    console.log('Creating users')
    for(let i = 1; i < 11; i++) {
        let password = "Aioub267";
        let username = "MockUser" + i
        createNewUser(username, password)
    }
}

module.exports = {
    createMockUsers
}

createMockUsers();