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

function createUserQueryInfo(username, password, email) {
    return new Promise((resolve, reject) => {
        hashString(password)
            .then(result => resolve([username, result.hash, result.salt, email]))
            .catch(err => reject(err))
    })
}

function hashString(inputString) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) reject(err);
            bcrypt.hash(inputString, salt, (err, hash) => {
                if(err) reject(err);
                resolve({hash, salt});
            })
        })
    })
}

function createNewUser(username, password, email) {
    return new Promise((resolve, reject) => {
        createUserQueryInfo(username, password, email)
            .then(values => {
                let queryString = `
                    INSERT INTO users (username, passwordHash, salt, email)
                    VALUES($1, $2, $3, $4);
                `
                return pool.query(queryString, values)
            })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        let queryString = `
            SELECT 
                id,
                username,
                passwordHash,
                salt,
                email
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

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        let queryString = `
            SELECT 
                id,
                username,
                passwordHash,
                salt,
                email
            FROM 
                users 
            WHERE 
                email = $1;
        `
        pool.query(queryString, [email])
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function getUserById(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT
            id,
            username,
            email
        FROM
            users
        WHERE
            id = $1;
        `
        pool.query(queryString, [userId])
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
        getUserByUsername(username)
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
                resolve(false);
            }
        })
    })
}

function removeUserByUsername(username) {
    return new Promise((resolve, reject) => {
        let queryString = `
            DELETE FROM users
            WHERE
                username = $1;
        `
        pool.query(queryString, [username])
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function updatePassword(password, userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
        UPDATE
            users
        SET
            passwordHash = $1,
            salt = $2
        WHERE
            id = $3;
        `
        hashString(password)
            .then(values => {
                return pool.query(queryString, [values.hash, values.salt, userId])
            })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

module.exports = {
    createUsersTable,
    dropUsersTable,
    createNewUser,
    getUserByUsername,
    getUserByEmail,
    checkUserCredentials,
    getUsers,
    removeUserByUsername,
    updatePassword,
    getUserById
}