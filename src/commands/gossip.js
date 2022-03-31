"use strict";

const { MAIN_CHAT } = process.env;

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");

module.exports = {
  name: "gossip",
  execute: async ({ context, bot }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const chatId = Number(MAIN_CHAT);
      const message = String(context.message.text)
        .replace("/gossip", "")
        .replace("@botnorrea_bot", "");
      if (message !== "") {
        return bot.telegram.sendMessage(chatId, message);
      }

      return context.replyWithMarkdown("`Please write a message to send`");
    } catch (error) {
      console.error("command gossip", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `Send a gossip to main Ebola chat!`,
};