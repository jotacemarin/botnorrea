"use strict";

const { MAIN_CHAT } = process.env;

const { connect, saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  cleanMessage,
  isEnabled,
} = require("../utils/telegraf");

const CURRENT_COMMAND = "gossip";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, bot }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);

      const chatId = Number(MAIN_CHAT);
      const message = cleanMessage(context.message.text);
      if (message !== "") {
        return bot.telegram.sendMessage(chatId, message);
      }

      return context.replyWithMarkdown("`Please write a message to send`");
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `Send a gossip to main Ebola chat!`,
};
