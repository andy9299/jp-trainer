"use strict";
/** Database setup for jp-trainer. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");
require('dotenv').config();

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    database: getDatabaseUri(),
    password: process.env.DB_PASSWORD
  });
}

db.connect();

module.exports = db;