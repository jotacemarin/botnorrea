"use strict";

const _ = require('lodash');

const CHAT_ID_PATH = "message.chat.id";
const TEST_BOTNORREA = -1001761165743;
const TEST_JOTACEMARIN = 1346557085;

const TEST_CHATS = [TEST_BOTNORREA, TEST_JOTACEMARIN];

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
