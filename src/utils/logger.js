"use strict";

const { MAIN_CHAT, ADMIN } = process.env;

const _ = require("lodash");

const CHAT_ID_PATH = "message.chat.id";

const TEST_CHATS = [Number(MAIN_CHAT), Number(ADMIN)];

const logger = (body) => {
  try {
    const id = _.get(body, CHAT_ID_PATH);

    if (TEST_CHATS.includes(id)) {
      console.log("event body:\n", JSON.stringify(body));
    }
  } catch (error) {
    console.error("logger", error);
  }
};

module.exports = {
  logger,
};
