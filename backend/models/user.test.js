"use strict";
process.env.NODE_ENV = "test";
const { NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSetIds } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// authenticate
describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("testuser1", "password1");
    expect(user).toEqual({
      username: "testuser1",
      email: "test1@testemail.com"
    });
  });
  test("unauth error if wrong password", async function () {
    try {
      await User.authenticate("testuser1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("unauth error if invalid user", async function () {
    try {
      await User.authenticate("wrong", "password1");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

// register
describe("register", function () {
  const newUser = {
    username: "newuser",
    email: "newemail@email.com"
  };
  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password"
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'newuser'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dupe username", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password"
      });
      await User.register({
        ...newUser,
        password: "password"
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("bad request with invalid email", async function () {
    try {
      await User.register({
        ...newUser,
        email: "email",
        password: "password"
      });
      fail();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });

});

// update
describe("update", function () {
  const updateData = {
    email: "new@email.com",
    password: "newpassword"
  };
  test("works", async function () {
    let updateRes = await User.update("testuser1", updateData);
    expect(updateRes).toEqual(
      {
        email: "new@email.com",
        username: "testuser1"
      }
    );
    const found = await db.query("SELECT * FROM users WHERE username = 'testuser1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].email).toEqual("new@email.com");
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });
  test("bad request with missing data", async function () {
    try {
      await User.update("testuser1", { email: "new@email.com" });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

//get
describe("get", function () {
  test("works", async function () {
    let getRes = await User.get("testuser2");
    expect(getRes).toEqual({
      username: "testuser2",
      email: "test2@testemail.com"
    });
  });
  test("NotFoundError on invalid user", async function () {
    try {
      await User.get("invalid");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// remove
describe("remove", function () {
  test("works", async function () {
    await User.remove("testuser1");
    const userCount = await db.query("SELECT COUNT(*) FROM users");
    expect(userCount.rows[0]["count"]).toEqual("1");
  });
  test("NotFoundError on invalid user", async function () {
    try {
      await User.remove("invalid");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});