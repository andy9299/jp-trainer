"use strict";
process.env.NODE_ENV = "test";
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const KanjiSet = require("./kanjiSet.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSetIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("getById", function () {
  test("works", async function () {
    let res = await KanjiSet.getById(testSetIds[1]);
    expect(res).toEqual({
      username: "testuser2",
      name: "set2",
      characters: ["協", "刊"]
    });
  });
  test("Not found error on invalid numerical id", async function () {
    try {
      await KanjiSet.getById(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("getByUsername", function () {
  test("works", async function () {
    let res = await KanjiSet.getByUsername("testuser2");
    expect(res).toEqual([
      {
        characters: ["撤"],
        id: testSetIds[0],
        name: "set1"
      },
      {
        characters: ["協", "刊"],
        id: testSetIds[1],
        name: "set2"
      }
    ]);
  });
  test("works on user with no sets", async function () {
    let res = await KanjiSet.getByUsername("testuser1");
    expect(res).toEqual([]);
  });
  test("Not found error on invalid username", async function () {
    try {
      await KanjiSet.getByUsername("invalid");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("createKanjiSet", function () {
  test("works", async function () {
    let res = await KanjiSet.createKanjiSet("testuser1", "testset");
    expect(res).toEqual({
      username: "testuser1",
      name: "testset",
      id: testSetIds[1] + 1
    });
    let setCount = await db.query(
      "SELECT * FROM kanji_sets WHERE username = $1"
      , ["testuser1"]);
    expect(setCount.rows.length).toEqual(1);
  });

  test("Not found error on invalid username", async function () {
    try {
      await KanjiSet.createKanjiSet("invalid", "testset");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("BadRequestError if hitting set limit", async function () {
    try {
      for (let i = 0; i < 21; i++) {
        await KanjiSet.createKanjiSet("testuser1", `testset${i}`);
      }
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("insertChar", function () {
  test("works", async function () {
    let res = await KanjiSet.insertChar(testSetIds[0], "戟", "testuser2");
    expect(res).toEqual({
      id: testSetIds[0],
      name: "set1",
      characters: ["撤", "戟"]
    });
  });
  test("Not found error on invalid id", async function () {
    try {
      await KanjiSet.insertChar(0, "戟", "testuser2");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("Unauthorized error on username mismatch", async function () {
    try {
      await KanjiSet.insertChar(testSetIds[0], "戟", "invalid");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("BadRequest error on adding non-unique character", async function () {
    try {
      await KanjiSet.insertChar(testSetIds[0], "撤", "testuser2");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  // tested by dropping limit 
  // test("BadRequest error on reaching set size limit", async function () {
  //   try {
  //     await KanjiSet.insertChar(testSetIds[1], "戟", "testuser2");
  //     fail();
  //   } catch (err) {
  //     expect(err instanceof BadRequestError).toBeTruthy();
  //   }
  // });

});

// describe("deleteChar", function () {
//   test("works", async function () {
//     let res = await KanjiSet.deleteChar(testSetIds[0], "撤", "testuser2");
//     expect(res).toEqual({
//       id: testSetIds[0],
//       name: "set1",
//       characters: []
//     });

//   });
//   test("Not found error on invalid id", async function () {
//     try {
//       await KanjiSet.deleteChar(0, "撤", "testuser2");
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
//   test("Unauthorized error on username mismatch", async function () {
//     try {
//       await KanjiSet.deleteChar(testSetIds[0], "撤", "invalid");
//       fail();
//     } catch (err) {
//       expect(err instanceof UnauthorizedError).toBeTruthy();
//     }
//   });
// });