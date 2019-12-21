const knex = require('knex');
const bookshelf = require('bookshelf');

const models = {};

const initializeDB = path => {
  const dbConnection = knex({
    client: 'sqlite3',
    connection: { filename: path },
    useNullAsDefault: true,
  });

  return dbConnection.migrate.latest({
    directory: __dirname + '/migrations',
  }).then(() => {
    const db = bookshelf(dbConnection);

    models.Product = db.model('Product', {
      hasTimestamps: ['createdAt', 'updatedAt'],
      tableName: 'products',
    });

    models.Customer = db.model('Customer', {
      hasTimestamps: ['createdAt', 'updatedAt'],
      tableName: 'customers',
    });

    return true;
  });
};

const model = m => models[m];

module.exports = {
  initializeDB,
  model,
};
