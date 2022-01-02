"use strict";

const {
  stringToJSON,
  createResponse,
  createErrorResponse,
} = require("./src/utils/parser");
const { logger } = require("./src/utils/logger");
const telegram = require("./src/telegraf");

const setWebhook = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const {
      headers: { Host },
      requestContext: { stage },
    } = event;

    const url = `https://${Host}/${stage}/webhook`;
    await telegram.setWebhook(url);

    return callback(null, createResponse({ success: true, url }));
  } catch (error) {
    const { message } = error;
    return callback(null, createErrorResponse(message));
  }
};

const webhook = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { body: bodyString } = event;
    
    const body = stringToJSON(bodyString);
    logger(body);

    await telegram.handleUpdate(body);

    return callback(null, createResponse());
  } catch (error) {
    const { message } = error;
    console.error("webhook: ", message);
    console.error("webhook: ", error);
    return callback(null, createErrorResponse(message));
  }
};

module.exports = {
  setWebhook,
  webhook,
};
