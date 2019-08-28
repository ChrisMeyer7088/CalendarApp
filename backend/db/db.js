const {createUsersTable, dropUsersTable} = require('./models/users');
const {createNoticesTable, dropNoticesTable} = require('./models/notices');

function dropTables() {
  dropNoticesTable()
    .then(dropUsersTable)
    .catch(err => console.log(err));
}

function createTables() {
  createUsersTable()
  .then(createNoticesTable)
  .catch(err => console.log(err))
}

function reInitalizeDB() {
  dropNoticesTable()
    .then(dropUsersTable)
    .then(createUsersTable)
    .then(createNoticesTable)
    .catch(err => console.log(err));
}

reInitalizeDB();

module.exports = {
  dropTables,
  createTables,
  reInitalizeDB
}