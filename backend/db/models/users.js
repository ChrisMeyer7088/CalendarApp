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
            .then(results => console.log(results))
            .catch(err => reject(err))
            .then(() => resolve())
    })
}

function createUsersTable() {
    return new Promise((resolve, reject) => {
        pool.query(createUsersTableQuery)
            .then(result => console.log(result))
            .catch(err => reject(err))
            .then(() => resolve())
    })
}

function createUserQuery(username, password) {
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
        createUserQuery(username, password)
            .then(values => {
                let queryString = `
                    INSERT INTO users (username, passwordHash, salt)
                    VALUES($1, $2, $3)
                `
                return pool.query(queryString, values)
            })
            .then(result => console.log(result))
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

module.exports = {
    createUsersTable,
    dropUsersTable,
    createNewUser
}