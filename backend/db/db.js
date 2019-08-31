const {createUsersTable, dropUsersTable} = require('./models/users');
const {createNoticesTable, dropNoticesTable} = require('./models/notices');
const { createTokenTable, dropTokenTable } = require('./models/token');

function dropTables() {
  dropNoticesTable()
    .then(dropTokenTable)
    .then(dropUsersTable)
    .catch(err => console.error(err.stack));
}

function createTables() {
  createUsersTable()
    .then(createTokenTable)
    .then(createNoticesTable)
    .catch(err => console.error(err.stack))
}

function reInitalizeDB() {
  //Data is dependent promises must be executed in a certain order
  dropNoticesTable()
    .then(dropTokenTable)
    .then(dropUsersTable)
    .then(createUsersTable)
    .then(createTokenTable)
    .then(createNoticesTable)
    .catch(err => console.error(err.stack));
}

reInitalizeDB();

module.exports = {
  dropTables,
  createTables,
  reInitalizeDB
}