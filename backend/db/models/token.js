const pg = require('pg');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'todoapp',
  host: 'localhost',
  database: 'todoapp',
  password: '1234!@#$qwerASD',
  port: 5432,
})

const deleteTokenTableQuery = `
    DROP TABLE IF EXISTS token;
`

const createTokenTableQuery = `
    CREATE TABLE token(
        id SERIAL PRIMARY KEY,
        ts TIMESTAMP NOT NULL,
        userId int4 REFERENCES users(id) ON DELETE CASCADE
    );
`
function dropTokenTable () {
    return new Promise((resolve, reject) => {
        pool.query(deleteTokenTableQuery)
            .then(result => resolve())
            .catch(err => reject(err))
    })
}

function createTokenTable () {
    return new Promise((resolve, reject) => {
        pool.query(createTokenTableQuery)
            .then(result => resolve())
            .catch(err => reject(err))
    })
} 

module.exports = {
    createTokenTable,
    dropTokenTable
}