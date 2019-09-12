const {createUsersTable, dropUsersTable} = require('./models/users');
const {createNoticesTable, dropNoticesTable} = require('./models/notices');
const { createTokenTable, dropTokenTable } = require('./models/token');
const { createCalendarTable, dropCalendarTable} = require('./models/calendar');

function dropTables() {
  dropNoticesTable()
    .then(dropTokenTable)
    .then(dropCalendarTable)
    .then(dropUsersTable)
    .catch(err => console.error(err.stack));
}

function createTables() {
  createUsersTable()
    .then(createTokenTable)
    .then(createNoticesTable)
    .then(createCalendarTable)
    .catch(err => console.error(err.stack))
}

function reInitalizeDB() {
  //Data is dependent promises must be executed in a certain order
  return new Promise((resolve, reject) => {
    dropNoticesTable()
    .then(result => dropTokenTable())
    .then(result => dropCalendarTable())
    .then(result => dropUsersTable())
    .then(result => createUsersTable())
    .then(result => createTokenTable())
    .then(result => createNoticesTable())
    .then(result => createCalendarTable())
    .then(result => resolve(result))
    .catch(err => reject(err));
  })
}

module.exports = {
  dropTables,
  createTables,
  reInitalizeDB
}