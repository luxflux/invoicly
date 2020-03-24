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
handlers['remove-product'] = ({ id }) => {
  const Product = model('Product');
  return new Product({ id }).destroy();
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
    lineItems: invoice.relations.lineItems,
    ...invoice.attributes,
    total: invoice.attributes.total || 0,
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
  return new Invoice({ id }).fetch({ withRelated: ['customer', 'lineItems'] }).then(mapInvoice);
};

const mapInvoiceLineItem = lineItem => lineItem.attributes;

handlers['create-invoice-line-item'] = data =>
  model('InvoiceLineItem')
    .forge(data)
    .save()
    .then(mapInvoiceLineItem);
handlers['update-invoice-line-item'] = ({ id, data }) => {
  const InvoiceLineItem = model('InvoiceLineItem');
  return new InvoiceLineItem({ id }).save(data, { patch: true }).then(mapInvoiceLineItem);
};
handlers['remove-invoice-line-item'] = id => {
  const InvoiceLineItem = model('InvoiceLineItem');
  return new InvoiceLineItem({ id }).destroy();
};

module.exports = handlers;
