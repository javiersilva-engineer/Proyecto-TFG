const { Pool } = require('pg');

const pool = new Pool({
  user: 'user_tfg',
  host: 'localhost',
  database: 'tfg_db',
  password: '1234',
  port: 5432,
});

module.exports = pool;
