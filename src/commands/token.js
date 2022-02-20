"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");
const { createCode } = require("../utils/donneve");

module.exports = {
  name: "token",
  execute: async (context) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const { message: { from } } = context;

      const code = await createCode(from);
      return context.replyWithMarkdown(`Your code is: *${code}*`);
    } catch (error) {
      console.error("command ping", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: "Retrieve a code to upload media in donneve.com",
};
