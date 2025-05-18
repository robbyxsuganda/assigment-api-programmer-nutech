const pg = require("pg");
const { Pool } = pg;
require("dotenv").config();

//! Gunakan ini jika dilocal
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   idleTimeoutMillis: 1000,
// });

//! Gunakan ini jika production
const pool = new Pool({
  connectionString: process.env.DB_URI,
  idleTimeoutMillis: 1000,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
