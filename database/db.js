const knex = require('knex');
const knexConfig = require('../knexfile');

// Use development environment for now
const db = knex(knexConfig.development);

module.exports = db;
