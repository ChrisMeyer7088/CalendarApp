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

const deleteUsersTableQuery = `
    DROP TABLE IF EXISTS users;
`

const createUsersTableQuery = `
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username varchar (50) NOT NULL,
        passwordHash varchar (100) NOT NULL,
        salt varchar (100) NOT NULL
    );
`
function dropUsersTable() {
    return new Promise((resolve, reject)=> {
        pool.query(deleteUsersTableQuery)
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function createUsersTable() {
    return new Promise((resolve, reject) => {
        pool.query(createUsersTableQuery)
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function createUserQueryInfo(username, password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) reject(err);
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) reject(err);
                resolve([username, hash, salt]);
            })
        })
    })
}

function createNewUser(username, password) {
    return new Promise((resolve, reject) => {
        createUserQueryInfo(username, password)
            .then(values => {
                let queryString = `
                    INSERT INTO users (username, passwordHash, salt)
                    VALUES($1, $2, $3);
                `
                return pool.query(queryString, values)
            })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function getUser(username, password = "") {
    return new Promise((resolve, reject) => {
        let queryString = `
            SELECT 
                id,
                username,
                passwordHash,
                salt 
            FROM 
                users 
            WHERE 
                username = $1;
        `
        pool.query(queryString, [username])
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function checkUserCredentials(username, password) {
    return new Promise((resolve, reject) => {
        getUser(username, password)
            .then(queryResult => {
                if(queryResult.rowCount === 1) {
                    let existingUser = queryResult.rows[0];
                    return compareUserCredentials(existingUser, password)
                } else {
                    resolve(false)
                }
            })
            .then(result => {
                resolve(result)
            })
            .catch((err) => reject(err))
    });
}

function compareUserCredentials(existingUser, password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, existingUser["salt"], (err, hash) => {
            if(err) reject(err);
            if(hash === existingUser["passwordhash"]) {
                resolve(existingUser["id"]);
            } else {
                resolve('');
            }
        })
    })
}

module.exports = {
    createUsersTable,
    dropUsersTable,
    createNewUser,
    getUser,
    checkUserCredentials
}