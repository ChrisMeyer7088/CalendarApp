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
  .catch(err => console.error(err.stack))
}

function reInitalizeDB() {
  //Data is dependent promises must be executed in a certain order
  dropNoticesTable()
    .then(dropUsersTable)
    .then(createUsersTable)
    .then(createNoticesTable)
    .catch(err => console.error(err.stack));
}

module.exports = {
  dropTables,
  createTables,
  reInitalizeDB
}