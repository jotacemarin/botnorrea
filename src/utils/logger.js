"use strict";

const TEST_BOTNORREA = -759778969;

const logger = (body) => {
  try {
    const { message } = body;
    const {
      chat: { id },
    } = message;
    if (id === TEST_BOTNORREA) {
      console.log("event body:\n", JSON.stringify(body));
    }
  } catch (error) {
    console.error("logger", error);
  }
};

module.exports = {
  logger,
};
