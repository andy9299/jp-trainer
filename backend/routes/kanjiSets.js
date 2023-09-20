"use strict";

/** Routes for kanjiSets. */

const jsonschema = require("jsonschema");

const express = require("express");
const KanjiSet = require("../models/kanjiSet");
const { BadRequestError } = require("../expressError");
const newKanjiSetNameSchema = require("../schemas/newKanjiSetName.json");
const singleCharacterSchema = require("../schemas/singleCharacter.json");

const router = express.Router();

/** GET /[id] => { kanji_set }
 *
 * Returns { id, name, characters}
 *
 **/

router.get("/id/:id", async function (req, res, next) {
  try {
    const kanjiSet = await KanjiSet.getById(req.params.id);
    return res.json({ kanjiSet });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { kanji_sets }
 *
 * Returns [{ id, name, characters}, ...]
 *
 **/

router.get("/user/:username", async function (req, res, next) {
  try {
    const kanjiSets = await KanjiSet.getByUsername(req.params.username);
    return res.json({ kanjiSets });
  } catch (err) {
    return next(err);
  }
});

/** POST / {username} => { kanji_set }
 *
 * Returns { id, name, username}
 *
 **/

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newKanjiSetNameSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const kanjiSet = await KanjiSet.createKanjiSet(res.locals.user.username, req.body.kanjiSetName);
    return res.json({ kanjiSet });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /id/[id]/insert {id, char, username} => {kanji_set}
 *
 * Returns { id, name, characters}
 *
 * Authorization required: same user as set creator
 **/

router.patch("/id/:id/insert", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, singleCharacterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const kanjiSet = await KanjiSet.insertChar(req.params.id, req.body.character, res.locals.user.username);
    return res.json({ kanjiSet });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /id/[id]/insert {id, char, username} => {kanji_set}
 *
 * Returns { id, name, characters}
 *
 * Authorization required: same user as set creator
 **/

router.patch("/id/:id/remove", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, singleCharacterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const kanjiSet = await KanjiSet.deleteChar(req.params.id, req.body.character, res.locals.user.username);
    return res.json({ kanjiSet });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

