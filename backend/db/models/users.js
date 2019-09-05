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
        username varchar (50) UNIQUE NOT NULL,
        passwordHash varchar (100) NOT NULL,
        salt varchar (100) NOT NULL
    );
`
function dropUsersTable() {
    return new Promise((resolve, reject)=> {
        pool.query(deleteUsersTableQuery)
            .then(result => {
                console.log('Dropping users table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

function createUsersTable() {
    return new Promise((resolve, reject) => {
        pool.query(createUsersTableQuery)
            .then(result => {
                console.log('Creating users table')
                resolve(result)
            })
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

function getUser(username) {
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

function getUsers() {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT
            id,
            username
        FROM
            users
        `
        pool.query(queryString)
            .then(result => resolve(result.rows))
            .catch(err => reject(err));
    })
}

function checkUserCredentials(username, password) {
    return new Promise((resolve, reject) => {
        if(!username) throw Error("Username cannot be empty")
        if(!password) throw Error("Password cannot be empty")
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

function removeUserByUsername(username) {
    return new Promise((resolve, reject) => {
        let queryString = `
            DELETE FROM users
            WHERE
                username = $1
        `
        pool.query(queryString, [username])
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

module.exports = {
    createUsersTable,
    dropUsersTable,
    createNewUser,
    getUser,
    checkUserCredentials,
    getUsers,
    removeUserByUsername
}