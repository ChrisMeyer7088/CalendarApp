const pg = require('pg');
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
        passwordHash varchar (50) NOT NULL,
        salt varchar (50) NOT NULL
    );
`
function dropUsersTable() {
    return new Promise((resolve, reject)=> {
        pool.query(deleteUsersTableQuery)
            .then(results => console.log(results))
            .catch(err => reject(err))
            .then(() => {
                resolve()
            })
    })
}

function createUsersTable() {
    return new Promise((resolve, reject) => {
        pool.query(createUsersTableQuery)
            .then(result => console.log(result))
            .catch(err => reject(err))
            .then(() => {
                resolve();
            })
    })
}

module.exports = {
    createUsersTable,
    dropUsersTable
}