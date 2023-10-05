"use strict";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class JpTrainerApi {
  // token to use api
  static token;

  // method to use to make requests to api
  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JpTrainerApi.token}` };
    const params = (method === "get")
      ? data
      : {};
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // auth routes
  static async getToken(loginInfo) {
    let res = await this.request(`auth/token`, loginInfo, "post");
    return res;
  }

  static async register(registerInfo) {
    let res = await this.request(`auth/register`, registerInfo, "post");
    return res;
  }

  // user routes - token must match with username
  static async getUser(username) {
    let res = await this.request(`users/${username}`, {}, "get");
    return res;
  }
  static async editUser(username, userDetails) {
    let res = await this.request(`users/${username}`, userDetails, "patch");
    return res;
  }
  static async deleteUser(username) {
    let res = await this.request(`users/${username}`, {}, "delete");
    return res;
  }

  // sets routes

  static async getKanjiSet(id) {
    let res = await this.request(`sets/id/${id}`, {}, "get");
    return res;
  }

  static async getUserKanjiSets(username) {
    let res = await this.request(`sets/user/${username}`, {}, "get");
    return res;
  }
  // requires matching username and token
  static async createKanjiSet(kanjiSetName) {
    let res = await this.request(`sets/`, { kanjiSetName }, "post");
    return res;
  }
  // requires matching username and token
  static async insertKanji(id, character) {
    let res = await this.request(`sets/id/${id}/insert`, { character }, "patch");
    return res;
  }
  // requires matching username and token
  static async removeKanji(id, character) {
    let res = await this.request(`sets/id/${id}/removechar`, { character }, "patch");
    return res;
  }
  // requires matching username and token
  static async deleteSet(id) {
    let res = await this.request(`sets/id/${id}/`, {}, "delete");
    return res;
  }
}

export default JpTrainerApi;

