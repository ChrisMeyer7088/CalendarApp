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

const deleteCalendarTableQuery = `
    DROP TABLE IF EXISTS calendar;
`

const createCalendarTableQuery = `
    CREATE TABLE calendar(
        id SERIAL PRIMARY KEY,
        backgroundImage TEXT,
        darkMode BOOLEAN NOT NULL,
        userId int4 REFERENCES users(id) ON DELETE CASCADE NOT NULL 
    );
`
function dropCalendarTable() {
    return new Promise((resolve, reject) => {
        pool.query(deleteCalendarTableQuery)
            .then(result => {
                console.log('Dropping calendar table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

function createCalendarTable() {
    return new Promise((resolve, reject) => {
        pool.query(createCalendarTableQuery)
            .then(result => {
                console.log('Creating calendar table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
} 

module.exports = {
    createCalendarTable,
    dropCalendarTable
}