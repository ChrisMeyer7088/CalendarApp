const {createUsersTable, dropUsersTable} = require('./models/users');
const {createNoticesTable, dropNoticesTable} = require('./models/notices');
const { createTokenTable, dropTokenTable } = require('./models/token');
const { createCalendarTable, dropCalendarTable} = require('./models/calendar');
const { addUniqueColumnEmailToUsers } = require('./migrations/migration01');
const { createTableResetLink, dropTableResetLink } = require('./models/resetLink');

function dropTables() {
  dropNoticesTable()
    .then(dropTokenTable)
    .then(dropTableResetLink)
    .then(dropCalendarTable)
    .then(dropUsersTable)
    .catch(err => console.error(err.stack));
}

function createTables() {
  createUsersTable()
    .then(createTokenTable)
    .then(createNoticesTable)
    .then(createCalendarTable)
    .then(createTableResetLink)
    .catch(err => console.error(err.stack))
}

function reInitalizeDB() {
  //Data is dependent promises must be executed in a certain order
  return new Promise((resolve, reject) => {
    dropNoticesTable()
    .then(result => dropTokenTable())
    .then(result => dropTableResetLink())
    .then(result => dropCalendarTable())
    .then(result => dropUsersTable())
    .then(result => createUsersTable())
    .then(result => createTokenTable())
    .then(result => createNoticesTable())
    .then(result => createCalendarTable())
    .then(result => createTableResetLink())
    .then(result => addMigrations())
    .then(result => resolve(result))
    .catch(err => reject(err));
  })
}

function addMigrations() {
  return new Promise((resolve, reject) => {
    addUniqueColumnEmailToUsers()
      .then(result => resolve(result))
      .catch(err => reject(err))
  })
}

module.exports = {
  dropTables,
  createTables,
  reInitalizeDB
}