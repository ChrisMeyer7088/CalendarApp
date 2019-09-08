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
        title TEXT NOT NULL,
        description TEXT,
        beginDate DATE NOT NULL,
        endDate DATE NOT NULL,
        color varchar (6) NOT NULL,
        userId int4 REFERENCES users(id) ON DELETE CASCADE NOT NULL 
    );
`
function dropNoticesTable() {
    return new Promise((resolve, reject) => {
        pool.query(deleteNoticesTableQuery)
            .then(result => {
                console.log('Dropping notices table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

function createNoticesTable() {
    return new Promise((resolve, reject) => {
        pool.query(createNoticesTableQuery)
            .then(result => {
                console.log('Creating notices table')
                resolve(result)
            })
            .catch(err => reject(err))
    })
}

function addNotice(title, beginDate, endDate, color, userId, description = "") {
    return new Promise((resolve, reject) => {
        let queryString = `
            INSERT INTO notices (title, beginDate, endDate, color, userId, description)
            VALUES($1, $2, $3, $4, $5, $6)
        `
        
        pool.query(queryString, [title, beginDate, endDate, color, userId, description])
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

function removeNotice(id) {
    return new Promise((resolve, reject) => {
        let queryString = `
            DELETE FROM notices
            WHERE notices.id = ${id}
        `
        
        pool.query(queryString)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}


function getUserNotices(userId) {
    return new Promise((resolve, reject) => {
        let queryString = `
            SELECT
                id,
                title,
                color,
                description,
                beginDate,
                endDate,
                userId
            FROM
                notices
            WHERE 
                userId = $1
        `
        
        pool.query(queryString, [userId])
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {
    createNoticesTable,
    dropNoticesTable,
    addNotice,
    removeNotice,
    getUserNotices
}