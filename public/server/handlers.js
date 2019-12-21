const { model } = require('./db');

const handlers = {};

handlers['fetch-products'] = () => model('Product').fetchAll();
handlers['create-product'] = data =>
  model('Product')
    .forge(data)
    .save();
handlers['product-set-archived'] = ({ id, archived }) => {
  const Product = model('Product');
  return new Product({ id }).save({ archived }, { patch: true });
};

const mapCustomer = ({ attributes }) => {
  const number = `K${attributes.id}`;
  return {
    number,
    asTitle: `${number}: ${attributes.name}`,
    ...attributes,
  };
};
handlers['fetch-customers'] = () =>
  model('Customer')
    .fetchAll()
    .then(customers => customers.map(mapCustomer));
handlers['create-customer'] = data =>
  model('Customer')
    .forge(data)
    .save()
    .then(mapCustomer);
handlers['customer-set-archived'] = ({ id, archived }) => {
  const Customer = model('Customer');
  return new Customer({ id }).save({ archived }, { patch: true }).then(mapCustomer);
};

const mapInvoice = invoice => {
  const number = `R${invoice.attributes.id}`;
  return {
    number,
    customer: invoice.relations.customer,
    ...invoice.attributes,
  };
};

handlers['fetch-invoices'] = () =>
  model('Invoice')
    .fetchAll({ withRelated: ['customer'] })
    .then(invoices => invoices.map(mapInvoice));
handlers['create-invoice'] = data =>
  model('Invoice')
    .forge(data)
    .save()
    .then(mapInvoice);
handlers['fetch-invoice'] = id => {
  const Invoice = model('Invoice');
  return new Invoice({ id }).fetch({ withRelated: ['customer'] }).then(mapInvoice);
};

module.exports = handlers;
