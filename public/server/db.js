const knex = require('knex');
const bookshelf = require('bookshelf');

const models = {};

const initializeDB = path => {
  const dbConnection = knex({
    client: 'sqlite3',
    connection: { filename: path },
    useNullAsDefault: true,
  });

  return dbConnection.migrate
    .latest({
      directory: __dirname + '/migrations',
    })
    .then(() => {
      const db = bookshelf(dbConnection);

      models.Product = db.model('Product', {
        hasTimestamps: ['createdAt', 'updatedAt'],
        tableName: 'products',
        lineItems() {
          return this.hasMany('InvoiceLineItem', 'invoiceId');
        },
        initialize() {
          this.on('fetching fetching:collection', (model, columns, options) => {
            options.query.select(db.knex.raw(
              `(SELECT COUNT(id) FROM invoiceLineItems WHERE invoiceLineItems.productId = products.id) AS itemCount`
            ));
          });
        },
      });

      models.Customer = db.model('Customer', {
        hasTimestamps: ['createdAt', 'updatedAt'],
        tableName: 'customers',
        lineItems() {
          return this.hasMany('InvoiceLineItem', 'customerId');
        },
      });

      models.Invoice = db.model('Invoice', {
        hasTimestamps: ['createdAt', 'updatedAt'],
        tableName: 'invoices',
        customer() {
          return this.belongsTo('Customer', 'customerId');
        },
        lineItems() {
          return this.hasMany('InvoiceLineItem', 'invoiceId');
        },
        initialize() {
          this.on('fetching fetching:collection', (model, columns, options) => {
            options.query.select(db.knex.raw(
              `(SELECT SUM(quantity * price) FROM invoiceLineItems WHERE invoiceLineItems.invoiceId = invoices.id) AS total`
            ));
          });
        },
      });

      models.InvoiceLineItem = db.model('InvoiceLineItem', {
        hasTimestamps: ['createdAt', 'updatedAt'],
        tableName: 'invoiceLineItems',
        invoice() {
          return this.belongsTo('Invoice', 'invoiceId');
        },
        product() {
          return this.belongsTo('Product', 'productId');
        },
      });

      return true;
    });
};

const model = m => models[m];

module.exports = {
  initializeDB,
  model,
};
