"use strict";

const {
  stringToJSON,
  createResponse,
  createErrorResponse,
} = require("./src/utils/parser");
const telegram = require("./src/telegraf");
const { haveCredentials } = require("./src/utils/telegraf");
const { logger } = require("./src/utils/logger");
const { trackMessage } = require("./src/utils/mixpanel");
const { connect: mongoConnect } = require("./src/persistence/mongodb");
const { connect: redisConnect } = require("./src/persistence/redis");

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
  const startTime = new Date();

  try {
    const { body: bodyString } = event;

    const body = stringToJSON(bodyString);
    logger(body);

    haveCredentials(body);
    await redisConnect();
    await mongoConnect();
    await telegram.handleUpdate(body);
    trackMessage(body);

    const endTime = new Date();
    console.log("[SUCCESS] time_execution: ", endTime - startTime);

    return callback(null, createResponse());
  } catch (error) {
    const { message } = error;
    const endTime = new Date();
    console.error(message);
    console.error(error);
    console.error("[FAIL] time_execution: ", endTime - startTime);
    return callback(null, createErrorResponse(message));
  }
};

const publicWebhook = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { body: bodyString } = event;

    const body = stringToJSON(bodyString);
    logger(body);

    await telegram.externalWebhook(body);

    return callback(null, createResponse());
  } catch (error) {
    const { message } = error;
    return callback(null, createErrorResponse(message));
  }
};

module.exports = {
  setWebhook,
  webhook,
  publicWebhook,
};
