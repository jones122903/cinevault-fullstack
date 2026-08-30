exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("actors", function (table) {
      table.string("image_public_id").nullable();
    }),

    knex.schema.table("producers", function (table) {
      table.string("image_public_id").nullable();
    }),

    knex.schema.table("movies", function (table) {
      table.string("poster_public_id").nullable();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table("actors", function (table) {
      table.dropColumn("image_public_id");
    }),

    knex.schema.table("producers", function (table) {
      table.dropColumn("image_public_id");
    }),

    knex.schema.table("movies", function (table) {
      table.dropColumn("poster_public_id");
    }),
  ]);
};