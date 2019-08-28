const pg = require('pg');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'todoapp',
  host: 'localhost',
  database: 'todoapp',
  password: '1234!@#$qwerASD',
  port: 5432,
})

const deleteNoticesTableQuery = `
    DROP TABLE IF EXISTS notices;
`

const createNoticesTableQuery = `
    CREATE TABLE notices(
        id SERIAL PRIMARY KEY,
        content varchar (80) NOT NULL,
        timestamp varchar (50) NOT NULL,
        userId int4 REFERENCES users(id) ON DELETE CASCADE
    );
`
function dropNoticesTable () {
    return new Promise((resolve, reject) => {
        pool.query(deleteNoticesTableQuery)
            .then(results => console.log(results))
            .catch(err => reject(err))
            .then(() => {
                resolve();
            })
    })
}

function createNoticesTable () {
    return new Promise((resolve, reject) => {
        pool.query(createNoticesTableQuery)
            .then(result => console.log(result))
            .catch(err => reject(err))
            .then(() => {
                resolve();
            })
    })
} 

module.exports = {
    createNoticesTable,
    dropNoticesTable
}