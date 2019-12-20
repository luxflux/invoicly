exports.up = function(knex) {
  return knex.schema.createTable('products', table => {
    table.increments('id').notNullable();
    table.decimal('price').notNullable();
    table.string('name').notNullable();
    table.datetime('created_at').notNullable();
    table.datetime('updated_at').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
