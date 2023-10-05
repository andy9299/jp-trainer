"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, email }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                  password,
                  email
           FROM users
           WHERE username = $1`, [username]
    );

    const user = result.rows[0];
    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, email}
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            email)
           VALUES ($1, $2, $3)
           RETURNING username, email`,
      [
        username,
        hashedPassword,
        email,
      ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Update user data with `data`.
   *
   * Data includes:
   *   { password, email}
   *
   * Returns { username, email}
   *
   * Throws NotFoundError if not found.
   *
   */

  static async update(username, data) {

    // try to find the user first
    const resultUser = await db.query(
      `SELECT username,
                  password,
                  email
           FROM users
           WHERE username = $1`, [username]
    );

    const checkUser = resultUser.rows[0];
    if (!checkUser) throw new UnauthorizedError("Invalid username");

    const isValid = await bcrypt.compare(data.oldPassword, checkUser.password);
    if (isValid === false) {
      throw new UnauthorizedError("Invalid Old Password");
    }

    data.newPassword = await bcrypt.hash(data.newPassword, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `UPDATE users
           SET email = $1, password = $2
           WHERE username = $3
           RETURNING username, email`,
      [data.email, data.newPassword, username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, email }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
              email
              FROM users
              WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

}


module.exports = User;
