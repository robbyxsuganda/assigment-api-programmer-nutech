const pool = require("../config/db.config");

async function migration() {
  try {
    // drop table
    const dropTable = `DROP TABLE IF EXISTS users, transactions, services, banners`;

    // create table users
    const ddlUsers = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    profile_Image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )`;

    // create table transactions
    const ddlServices = `CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) NOT NULL UNIQUE,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255),
    service_tariff DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )`;

    // create table transactions
    const ddlTransactions = `CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    service_code VARCHAR(50) REFERENCES services(service_code),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )`;

    // create table transactions
    const ddlBanners = `CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    banner_name  VARCHAR(100) NOT NULL,
    banner_image  VARCHAR(255) NOT NULL,
    description TEXT
  )`;

    await pool.query(dropTable);
    console.log("drop table succes");
    await pool.query(ddlUsers);
    console.log("table users created");
    await pool.query(ddlServices);
    console.log("table services created");
    await pool.query(ddlTransactions);
    console.log("table transactions created");
    await pool.query(ddlBanners);
    console.log("table banners created");
  } catch (error) {
    console.log(error);
  }
}

migration();
