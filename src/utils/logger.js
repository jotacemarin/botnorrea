"use strict";

const TEST_BOTNORREA = -759778969;

const logger = (body) => {
  const { message } = body;
  const {
    chat: { id },
  } = message;
  if (id === TEST_BOTNORREA) {
    console.log("event body:\n", JSON.stringify(body));
  }
};

module.exports = {
  logger,
};
