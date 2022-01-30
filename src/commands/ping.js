"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");

module.exports = {
  name: "ping",
  execute: async (context) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      return context.replyWithMarkdown("*Pong!*");
    } catch (error) {
      console.error("command ping", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `Only respond *Pong!*`,
};
