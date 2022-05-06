"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "ping",
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      return context.replyWithMarkdown("*Pong!*", extra);
    } catch (error) {
      console.error("command ping", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: `Only respond *Pong!*`,
};
