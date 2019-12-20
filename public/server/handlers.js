const { model } = require('./db');

const handlers = {};

handlers['create-product'] = ({ name, price }) => model('Product').forge({ name, price }).save();

handlers['fetch-products'] = () => model('Product').fetchAll();

module.exports = handlers;
