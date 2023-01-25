"use strict";

const { OK, INTERNAL_SERVER_ERROR } = require("http-status");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const stringToJSON = (objectString) => {
  try {
    return JSON.parse(objectString);
  } catch (error) {
    const { message } = error;
    throw new Error(`stringToJSON: ${message}`);
  }
};

const createResponse = (response = null, statusCode = OK) => {
  const payload = {
    headers,
    statusCode,
  };

  if (response && typeof response === "object") {
    payload.body = JSON.stringify(response);
  }

  return payload;
};

const createErrorResponse = (error = "", status = INTERNAL_SERVER_ERROR) => {
  return createResponse({ error }, status);
};

const createAnonymousMessage = (rawMessage = "") => {
  const message = String(rawMessage);
  return `Anonymous sends us: ${message ? message : "..."}`;
};

module.exports = {
  createResponse,
  createErrorResponse,
  stringToJSON,
  createAnonymousMessage,
};
