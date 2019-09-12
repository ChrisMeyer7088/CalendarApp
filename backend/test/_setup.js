process.env.NODE_ENV = 'test'
const { reInitalizeDB } = require('../db/db')

before("Reinitalize the Database for test cases", () => {
    return reInitalizeDB()
})