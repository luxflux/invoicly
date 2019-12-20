const { remote } = require('electron');
const knex = require('knex');
const bookshelf = require('bookshelf');

const dbPath = `${remote.app.getPath('userData')}/invoicly.sqlite3`;

const dbConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

const db = bookshelf(dbConnection);

const Product = db.model('Product', {
  hasTimestamps: true,
  tableName: 'products',
});

module.exports = {
  dbConnection,
  db,
  Product,
};
