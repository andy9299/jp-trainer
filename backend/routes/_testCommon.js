"use strict";

const db = require("../db");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const testSetIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM kanji_sets");

  await User.register({
    username: "testuser1",
    email: "test1@testemail.com",
    password: "password1"
  });
  await User.register({
    username: "testuser2",
    email: "test2@testemail.com",
    password: "password2"
  });

  // need permissions to add so just insert directly
  const resSets = await db.query(`
    INSERT INTO kanji_sets (username, characters, name) 
    VALUES  ('testuser1', ARRAY ['撤'], 'set1'),
            ('testuser1' , ARRAY ['協', '刊'], 'set2')
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


const u1Token = createToken({ username: "testuser1" });
const u2Token = createToken({ username: "testuser2" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSetIds,
  u1Token,
  u2Token
};
