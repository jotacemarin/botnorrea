"use strict";

const { DONNEVE_PAGE } = process.env;

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");
const { createCode } = require("../utils/donneve");

module.exports = {
  name: "token",
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const {
        message: { from },
      } = context;

      const code = await createCode(from);
      const message = `Your code is: *${code}*\n\nUse in ${DONNEVE_PAGE}?token=${code}`;
      return context.replyWithMarkdown(message, extra);
    } catch (error) {
      console.error("command token", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: `Retrieve a code to upload media in ${DONNEVE_PAGE}`,
};
