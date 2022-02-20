"use strict";

const { DONNEVE_API } = process.env;

const axios = require("axios").default;

const donneve = axios.create({
  baseURL: DONNEVE_API,
  timeout: 10000,
});

const createCode = async (from) => {
  const {
    data: { code },
  } = await donneve.post("createCode", { from });
  return code;
};

module.exports = {
  createCode,
};
