exports.up = function(knex) {
  return knex.schema.alterTable('invoiceLineItems', table => {
    table.integer('quantity').defaultTo(1).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('invoiceLineItems', table => {
    table.dropColumn('quantity');
  });
};
