const pg = require('pg');
const { generateTokenValue } = require('./token')
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

function createResetLink(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
            INSERT into resetlink(userId, ts, value)
            VALUES ($1, to_timestamp($2 / 1000.0), $3)
        `
        generateTokenValue(userId)
            .then(value => {
                return pool.query(queryString, [userId, Date.now(), value])
            })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function getActiveResetLink(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT 
            value
        FROM 
            resetlink
        WHERE
            userId = $1 AND
            ts > to_timestamp(${Date.now() - (1 + 60 * 60 * 1000)} / 1000.0)    
        `

        pool.query(queryString, [userId])
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
}

module.exports = {
    createTableResetLink,
    dropTableResetLink,
    createResetLink,
    getActiveResetLink
}