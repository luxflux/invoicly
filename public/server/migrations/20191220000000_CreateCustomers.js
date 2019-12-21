exports.up = function(knex) {
  return knex.schema.createTable('customers', table => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('street').notNullable();
    table.string('zipCode').notNullable();
    table.string('city').notNullable();
    table.string('country').notNullable();
    table.boolean('archived').default(false).notNullable();
    table.datetime('createdAt').notNullable();
    table.datetime('updatedAt').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
