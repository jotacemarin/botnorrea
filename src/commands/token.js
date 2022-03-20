"use strict";

const { DONNEVE_PAGE } = process.env;

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");
const { createCode } = require("../utils/donneve");

module.exports = {
  name: "token",
  execute: async ({ context }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const {
        message: { from },
      } = context;

      const code = await createCode(from);
      const message = `Your code is: *${code}*\n\nUse in ${DONNEVE_PAGE}`;
      return context.replyWithMarkdown(message);
    } catch (error) {
      console.error("command token", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `Retrieve a code to upload media in ${DONNEVE_PAGE}`,
};
