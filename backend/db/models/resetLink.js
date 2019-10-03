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

const deleteResetLinkTableQuery = `
    DROP TABLE IF EXISTS resetlink;
`

const ADDRESETLINKSTABLE = `
    CREATE TABLE resetlink(
    id SERIAL PRIMARY KEY,
    userId int4 REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    value varchar (100) UNIQUE NOT NULL,
    ts TIMESTAMP NOT NULL
    );
`

function createTableResetLink() {
    return new Promise((resolve, reject) => {
        pool.query(ADDRESETLINKSTABLE)
            .then(result => {
                console.log('Adding table resetlink')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}


function dropTableResetLink() {
    return new Promise((resolve, reject) => {
        pool.query(deleteResetLinkTableQuery)
            .then(result => {
                console.log('Dropping table resetlink')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    createTableResetLink,
    dropTableResetLink
}