const pg = require('pg');
const bcrypt = require('bcrypt')
const { DBHost, DBName, DBPass, DBUser } = require('../../config')
const Pool = pg.Pool;
const pool = new Pool({
    user: DBUser,
    host: DBHost,
    database: DBName,
    password: DBPass,
    port: process.env.DB_PORT
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
        let value = '';
        let queryString = `
        INSERT INTO token (value, ts, userId)
            VALUES ($1, to_timestamp($2 / 1000.0), $3);
        `;
        generateTokenValue(userId)
            .then(tokenValue => {
                value = tokenValue;
                return pool.query(queryString, [tokenValue, Date.now(), userId])
            })
            .then(queryResult => {
                resolve(value)
            })
            .catch(err => reject(err))
    })
}

function generateTokenValue(userId) {
    return new Promise((resolve, reject) => {
        let value = userId + Date.now().toString();
        bcrypt.genSalt(10, (err, salt) => {
            if(err)  reject(err);
            bcrypt.hash(value, salt, (err, hash) => {
                if(err) reject(err);
                resolve(hash);
            })
        })
    })
}

function getAssociatedUser(tokenValue) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT
            value,
            userId
        FROM
            token
        WHERE
            value = $1 AND
            ts > to_timestamp(${Date.now() - (1 + 60 * 60 * 1000)} / 1000.0)
        `;
        pool.query(queryString, [tokenValue])
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function checkForActiveToken(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT
            value
        FROM
            token
        WHERE
            userId = ${userId} AND
            ts > to_timestamp(${Date.now() - (1 + 60 * 60 * 1000)} / 1000.0)
        `;
        pool.query(queryString)
            .then(queryResult => {
                resolve(queryResult)
            })
            .catch(err => reject(err))
    })
}

function deleteToken(value) {
    return new Promise((resolve, reject) => {
        let queryString = `
        DELETE FROM token
        WHERE token.value = $1
        `
        pool.query(queryString, [value])
            .then(result => {
                resolve(result)})
            .catch(err => {
                reject(err)})
    })
}

module.exports = {
    createTokenTable,
    dropTokenTable,
    createToken,
    checkForActiveToken,
    getAssociatedUser,
    deleteToken
}