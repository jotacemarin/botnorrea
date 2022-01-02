"use strict";

const { google } = require("googleapis");
const credentials = require("../../../credentials/botnorrea-336821-02d3adb0ebbe.json");

const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);
const drive = google.drive({ version: "v3", auth });
const requestBody = {
  role: "reader",
  type: "anyone",
};

const getFile = async (fileId) => {
  await drive.permissions.create({
    fileId,
    requestBody,
  });

  const {
    data: { webContentLink },
  } = await drive.files.get({
    fileId,
    fields: "webContentLink",
  });

  return webContentLink;
};

module.exports = {
  getFile,
};
