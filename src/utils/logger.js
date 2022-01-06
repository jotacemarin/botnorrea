"use strict";

const TEST_BOTNORREA = -759778969;
const TEST_JOTACEMARIN = 1346557085;

const TEST_CHATS = [TEST_BOTNORREA, TEST_JOTACEMARIN];

const logger = (body) => {
  try {
    const {
      message: {
        chat: { id },
      },
    } = body;

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
