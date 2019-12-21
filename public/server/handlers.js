const { model } = require('./db');

const handlers = {};

handlers['create-product'] = ({ name, netPrice, grossPrice }) =>
  model('Product')
    .forge({ name, netPrice, grossPrice })
    .save();

handlers['fetch-products'] = () => model('Product').fetchAll();

handlers['product-set-archived'] = ({ id, archived }) => {
  const Product = model('Product');
  return new Product({ id }).save({ archived }, { patch: true });
};

module.exports = handlers;
