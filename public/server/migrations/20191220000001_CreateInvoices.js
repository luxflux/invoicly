exports.up = function(knex) {
  return knex.schema
    .createTable('invoices', table => {
      table.increments('id').notNullable();
      table.integer('customerId').notNullable();
      table.datetime('date').notNullable();
      table.datetime('createdAt').notNullable();
      table.datetime('updatedAt').notNullable();

      table.foreign('customerId').references('customers.id');
    })
    .createTable('invoiceLineItems', table => {
      table.increments('id').notNullable();
      table.integer('invoiceId').notNullable();
      table.integer('productId').notNullable();
      table.decimal('price').notNullable();
      table.datetime('createdAt').notNullable();
      table.datetime('updatedAt').notNullable();

      table.foreign('invoiceId').references('invoices.id');
      table.foreign('productId').references('products.id');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('invoices').dropTable('invoiceLineItems');
};
