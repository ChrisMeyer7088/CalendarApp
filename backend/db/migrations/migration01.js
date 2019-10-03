const pg = require('pg');
const { DBHost, DBName, DBPass, DBUser } = require('../../config')
const Pool = pg.Pool;
const pool = new Pool({
    user: DBUser,
    host: DBHost,
    database: DBName,
    password: DBPass,
    port: process.env.DB_PORT
})

const ADDEMAILTOUSERTABLEQUERY = `ALTER TABLE users
        ADD COLUMN email varchar (50) UNIQUE NOT NULL;`


function addUniqueColumnEmailToUsers() {
    return new Promise((resolve, reject) => {
        pool.query(ADDEMAILTOUSERTABLEQUERY)
            .then(result => {
                console.log('Adding column email to Table users')
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {
    addUniqueColumnEmailToUsers
}