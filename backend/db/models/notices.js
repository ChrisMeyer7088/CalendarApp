const pg = require('pg');
const { DBHost, DBName, DBPass, DBUser } = require('../../config')
const Pool = pg.Pool;
const pool = new Pool({
    user: DBUser,
    host: DBHost,
    database: DBName,
    password: DBPass,
    port: process.env.DB_PORT
})

const deleteNoticesTableQuery = `
    DROP TABLE IF EXISTS notices;
`

const createNoticesTableQuery = `
    CREATE TABLE notices(
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        beginDate TIMESTAMP NOT NULL,
        endDate TIMESTAMP NOT NULL,
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
            VALUES($1, to_timestamp($2), to_timestamp($3), $4, $5, $6)
        `
        pool.query(queryString, [title, beginDate.getTime() / 1000, endDate.getTime() / 1000, color, userId, description])
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


function getUserNotices(userId, date) {
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
                AND EXTRACT(MONTH from beginDate) = $2
                AND EXTRACT(YEAR from beginDate) = $3;
        `
        pool.query(queryString, [userId, date.getMonth() + 1, date.getFullYear()])
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