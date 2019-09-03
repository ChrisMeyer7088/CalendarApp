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
  dropNoticesTable()
    .then(dropTokenTable)
    .then(dropCalendarTable)
    .then(dropUsersTable)
    .then(createUsersTable)
    .then(createTokenTable)
    .then(createNoticesTable)
    .then(createCalendarTable)
    .catch(err => console.error(err.stack));
}

dropCalendarTable()
  .then(res => {
    console.log(res);
    return createCalendarTable();
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));

module.exports = {
  dropTables,
  createTables,
  reInitalizeDB
}