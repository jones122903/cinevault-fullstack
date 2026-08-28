exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.enum('role', ['admin', 'user']).defaultTo('user');
      table.timestamps(true, true);
    })
    .createTable('actors', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.enum('gender', ['Male', 'Female', 'Other']).notNullable();
      table.date('dob').notNullable();
      table.text('bio');
      table.string('image');
      table.timestamps(true, true);
    })
    .createTable('producers', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.enum('gender', ['Male', 'Female', 'Other']).notNullable();
      table.date('dob').notNullable();
      table.text('bio');
      table.string('image');
      table.timestamps(true, true);
    })
    .createTable('movies', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('yearOfRelease').notNullable();
      table.text('plot');
      table.string('poster');
      table.integer('producer_id').unsigned().references('id').inTable('producers').onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('movie_actors', function(table) {
      table.integer('movie_id').unsigned().references('id').inTable('movies').onDelete('CASCADE');
      table.integer('actor_id').unsigned().references('id').inTable('actors').onDelete('CASCADE');
      table.primary(['movie_id', 'actor_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('movie_actors')
    .dropTableIfExists('movies')
    .dropTableIfExists('producers')
    .dropTableIfExists('actors')
    .dropTableIfExists('users');
};
