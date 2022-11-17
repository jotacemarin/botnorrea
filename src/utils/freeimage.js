"use strict";

const { FREEIMAGE_API } = process.env;

const axios = require("axios").default;

const donneve = axios.create({
  baseURL: FREEIMAGE_API,
  timeout: 10000,
});

const uploadPic = async (url) => {
  const from = new URLSearchParams();
  from.append("source", url);
  from.append("type", "url");
  from.append("action", "upload");
  from.append("timestamp", "1668657048499");
  from.append("nsfw", "0");

  const {
    data: { image: { url: urlUploaded }, },
  } = await donneve.post("/json", from);
  return urlUploaded;
};

module.exports = {
  uploadPic,
};
