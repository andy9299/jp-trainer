"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSetIds,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */

describe("GET /users/:username", function () {
  test("works ", async function () {
    const resp = await request(app)
      .get(`/users/testuser1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "testuser1",
        email: "test1@testemail.com"
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
      .get(`/users/testuser1`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/users/testuser1");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/users/testuser1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/users/testuser1`)
      .send({
        email: "new@email.com",
        password: "newpassword"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "testuser1",
        email: "new@email.com",
      },
    });
    const isSuccessful = await User.authenticate("testuser1", "newpassword");
    expect(isSuccessful).toBeTruthy();
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/users/testuser1`)
      .send({
        email: "new@email.com",
        password: "newpassword"
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
      .patch(`/users/nope`)
      .send({
        email: "new@email.com",
        password: "newpassword"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/testuser1`)
      .send({})
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {

  test("works", async function () {
    const resp = await request(app)
      .delete(`/users/testuser1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "testuser1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/users/testuser1`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/users/testuser1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
