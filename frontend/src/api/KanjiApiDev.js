"use strict";

import axios from "axios";

// Online API from https://kanjiapi.dev/#!/

const BASE_URL = "https://kanjiapi.dev/v1";

class KanjiApiDev {
  static async kanjiChar(char) {
    const url = `${BASE_URL}/kanji/${char}`;
    try {
      return (await axios({ url, method: "get" })).data;
    }
    catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  static async kanjiGrade(grade) {
    if (6 < grade) {
      throw new Error("Grade must be an int [1,6]");
    }
    const url = `${BASE_URL}/kanji/grade-${grade}`;
    try {
      return (await axios({ url, method: "get" })).data;
    }
    catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }
  static async reading(reading) {
    const url = `${BASE_URL}/reading/${reading}`;
    try {
      return (await axios({ url, method: "get" })).data;
    }
    catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  static async word(word) {
    const url = `${BASE_URL}/words/${word}`;
    try {
      return (await axios({ url, method: "get" })).data;
    }
    catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }
}

export default KanjiApiDev;