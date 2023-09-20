"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


class KanjiSet {
  /** get kanjiset by id
 * Returns { username, name, characters: [kanji1, kanji2...] }
 *
 * Throws NotFoundError if invalid id
 **/
  static async getById(id) {
    let result;

    result = await db.query(
      `
      SELECT username, name, characters
      FROM kanji_sets
      WHERE id=$1
      `, [id]
    );

    const kanjiSetRow = result.rows[0];
    if (kanjiSetRow) {
      return kanjiSetRow;
    }
    throw new NotFoundError("Id not found");
  }

  /** get kanjiset by username
  * Returns { id, name, characters: [kanji1, kanji2...] }
  *
  * Throws NotFoundError if invalid id
  **/
  static async getByUsername(username) {
    const found = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (found.rows.length === 0) {
      throw new NotFoundError("Invalid Username");
    }
    const result = await db.query(
      `
      SELECT id, name, characters
      FROM kanji_sets
      WHERE username=$1
      ORDER BY name ASC
      `, [username]
    );
    return result.rows;
  }

  /** create kanjiSet (limited 20 per user)
  * Returns { id, name } on success
  * 
  * Throws NotFoundError if user not found
  * Throws BadRequestError if user has too many sets
  **/
  static async createKanjiSet(username, setName) {
    const found = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (found.rows.length === 0) {
      throw new NotFoundError("Invalid Username");
    }
    const setCount = await db.query(
      "SELECT * FROM kanji_sets WHERE username = $1"
      , [username]);

    if (setCount.rows.length >= 20) {
      throw new BadRequestError("Limit 20 Kanji Sets");
    }
    const result = await db.query(
      `
      INSERT INTO kanji_sets
        (username,
        name,
        characters)
      VALUES ($1, $2, ARRAY []::VARCHAR [])
      RETURNING username, name, id
      `, [username, setName]
    );
    return result.rows[0];
  }

  /** insert kanji in a set (100 limit)
  * Returns { id, name, characters } on success
  * 
  * Throws NotFoundError if id not found
  * Throws Unauthorized if username does not match
  **/

  static async insertChar(id, char, username) {
    const found = await db.query("SELECT username, characters FROM kanji_sets WHERE id = $1", [id]);
    if (found.rows.length === 0) {
      throw new NotFoundError("Invalid Id");
    }
    if (found.rows[0].username !== username) {
      throw new UnauthorizedError("Not Authorized");
    }
    if (found.rows[0].characters.length >= 500) {
      throw new BadRequestError("Max Set Size is 500");
    }
    if (found.rows[0].characters.includes(char)) {
      throw new BadRequestError("Set Must Be Unique Characters");
    }
    const updateRes = await db.query(`
      UPDATE kanji_sets 
      SET characters = array_append(characters, $1)
      WHERE id = $2
      RETURNING id, name, characters`,
      [char, id]);
    return updateRes.rows[0];
  }

  /** delete kanji in a set
  * Returns { id, name, characters } on success
  * 
  * Throws NotFoundError if id not found
  **/

  static async deleteChar(id, char, username) {
    const found = await db.query("SELECT * FROM kanji_sets WHERE id = $1", [id]);
    if (found.rows.length === 0) {
      throw new NotFoundError("Invalid Id");
    }
    if (found.rows[0].username !== username) {
      throw new UnauthorizedError("Not Authorized");
    }
    const updateRes = await db.query(`
      UPDATE kanji_sets 
      SET characters = array_remove(characters, $1)
      WHERE id = $2
      RETURNING id, name, characters`,
      [char, id]);
    return updateRes.rows[0];
  }

  /** Delete given user from database;
   * Returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM kanji_sets
           WHERE id = $1
           RETURNING id`,
      [id],
    );
    const set = result.rows[0];

    if (!set) throw new NotFoundError(`No kanjiset with id: ${id}`);
  }
}

module.exports = KanjiSet;
