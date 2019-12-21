exports.up = function(knex) {
  return knex.schema.createTable('products', table => {
    table.increments('id').notNullable();
    table.decimal('netPrice').notNullable();
    table.decimal('grossPrice').notNullable();
    table.string('name').notNullable();
    table.boolean('archived').default(false).notNullable();
    table.datetime('createdAt').notNullable();
    table.datetime('updatedAt').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
