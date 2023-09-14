"use strict";

const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require('../config');

let testSetIds = [];

async function commonBeforeAll() {
  // before starting the test clear all tables
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM kanji_sets");

  await db.query(`
    INSERT INTO users (username, password, email) 
    VALUES  ('testuser1', $1,'test1@testemail.com'),
            ('testuser2', $2,'test2@testemail.com')`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)
    ]);
  const resSets = await db.query(`
    INSERT INTO kanji_sets (username, characters, name) 
    VALUES  ('testuser2', ARRAY ['撤'], 'set1'),
            ('testuser2' , ARRAY ['協', '刊'], 'set2')
    RETURNING id`
  );

  testSetIds.splice(0, 0, ...resSets.rows.map(r => r.id));
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSetIds
};