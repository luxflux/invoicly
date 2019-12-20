const { Product } = require('./db');

const handlers = {};

handlers['create-product'] = ({ name, price }) => Product.forge({ name, price }).save();

handlers['fetch-products'] = () => Product.fetchAll();

module.exports = handlers;
