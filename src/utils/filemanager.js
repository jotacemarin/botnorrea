"use strict";

const { FILESMANAGER_API } = process.env;

const axios = require("axios").default;

const filesManager = axios.create({ baseURL: FILESMANAGER_API, timeout: 5000 });

const getRandom = async () => {
  const {
    data: { webContentUrl },
  } = await filesManager.get("/Files/random");
  return webContentUrl;
};

const searchByTags = async (tags = []) => {
  const {
    data: { webContentUrl },
  } = await filesManager.post("/Tags/search", tags);
  return webContentUrl;
};

const setTags = async (webContentUrl = "", tags = []) => {
  const body = { webContentUrl, tags, remoteId: null };
  const { data } = await filesManager.post("/Tags", body);
  const tagsAdded = data.map(({ tag: { value } }) => value);
  return tagsAdded;
};

module.exports = {
  getRandom,
  searchByTags,
  setTags,
};
