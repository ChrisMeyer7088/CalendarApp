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
        beginTime TIME NOT NULL,
        endTime TIME NOT NULL,
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

function addNotice(title, beginDate, endDate, beginTime, endTime, color, userId, description = "") {
    return new Promise((resolve, reject) => {
        let queryString = `
            INSERT INTO notices (title, beginDate, endDate, beginTime, endTime, color, userId, description)
            VALUES(${title}, ${beginDate}, ${endDate}, ${beginTime}, ${endTime}, ${color}, ${userId}, ${description})
        `
        
        pool.query(queryString)
            .then(result => {
                console.log(result);
                resolve(result)
            })
            .catch(err => {
                console.error(err);
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
                console.log(result);
                resolve(result)
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
    })
}


function getNotices(userId, beginDate) {
    return new Promise((resolve, reject) => {
        let queryString = `
            SELECT
                id
                title
                color
            FROM
                notices
            WHERE 
                userId = ${userId} AND
                date_part('month', timestamp ${beginDate})
        `
        
        pool.query(queryString)
            .then(result => {
                console.log(result);
                resolve(result)
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
    })
}

function getNotice(id) {
    return new Promise((resolve, reject) => {
        let queryString = `
            SELECT
                title
                beginDate
                endDate
                beginTime
                endTime
                color
                description
            FROM
                notices
            WHERE 
                id = ${id}
        `
        
        pool.query(queryString)
            .then(result => {
                console.log(result);
                resolve(result)
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
    })
}

module.exports = {
    createNoticesTable,
    dropNoticesTable,
    addNotice,
    removeNotice
}