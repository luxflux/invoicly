const { model } = require('./db');

const handlers = {};

handlers['create-product'] = data =>
  model('Product')
    .forge(data)
    .save();

handlers['fetch-products'] = () => model('Product').fetchAll();

handlers['product-set-archived'] = ({ id, archived }) => {
  const Product = model('Product');
  return new Product({ id }).save({ archived }, { patch: true });
};

handlers['fetch-customers'] = () => model('Customer').fetchAll();
handlers['create-customer'] = data =>
  model('Customer')
    .forge(data)
    .save();
handlers['customer-set-archived'] = ({ id, archived }) => {
  const Customer = model('Customer');
  return new Customer({ id }).save({ archived }, { patch: true });
};

module.exports = handlers;
