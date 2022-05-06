"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "debug",
  execute: async ({ context }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);
      const { update, botInfo } = context;

      const extra = getMessageId(context);
      const message = "`" + JSON.stringify({ update, botInfo }, null, 2) + "`";
      return context.replyWithMarkdown(message, extra);
    } catch (error) {
      console.error("command setgroup", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: "Helper developer command",
};
