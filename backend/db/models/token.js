const pg = require('pg');
const bcrypt = require('bcrypt')
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
        value TEXT UNIQUE NOT NULL,
        ts TIMESTAMP NOT NULL,
        userId int4 REFERENCES users(id) ON DELETE CASCADE NOT NULL
    );
`
function dropTokenTable () {
    return new Promise((resolve, reject) => {
        pool.query(deleteTokenTableQuery)
            .then(result => {
                console.log('Dropping token table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

function createTokenTable () {
    return new Promise((resolve, reject) => {
        pool.query(createTokenTableQuery)
            .then(result => {
                console.log('Creating token table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

function createToken(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        INSERT INTO token (value, ts, userId)
        VALUES($1, to_timestamp(${Date.now()} / 1000.0), $2);
        `;
        generateTokenValue(userId)
            .then(hash => pool.query(queryString, [hash, userId]))
            .then(result => getActiveToken(userId))
            .then(queryResult => {
                console.log(queryResult)
            })
            .catch(err => reject(err))
    })
}

function generateTokenValue(userId) {
    return new Promise((resolve, reject) => {
        let value = userId + Date.now().toString();
        bcrypt.genSalt(10, (err, salt) => {
            if(err) reject(err);
            bcrypt.hash(value, salt, (err, hash) => {
                if(err) reject(err);
                resolve(hash);
            })
        })
    })
}

function getActiveToken(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT
            value
        FROM
            token
        WHERE
            ts > to_timestamp(${Date.now()}
        LIMIT 1;
        `;
        pool.query(queryString)
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function getAssociatedUser(tokenId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT 
            userId 
        FROM 
            token
        WHERE
            id = $1;
        `;
        pool.query(queryString, [tokenId])
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

module.exports = {
    createTokenTable,
    dropTokenTable,
    createToken,
    getAssociatedUser
}