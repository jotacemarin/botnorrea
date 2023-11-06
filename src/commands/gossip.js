"use strict";

const { MAIN_CHAT } = process.env;

const { saveUserModel } = require("../persistence/mongodb");
const { createAnonymousMessage } = require("../utils/parser");
const {
  haveCredentials,
  cleanMessage,
  isEnabled,
  getMessageId,
} = require("../utils/telegraf");

const CURRENT_COMMAND = "gossip";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, bot }) => {
    try {
      haveCredentials(context);

      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);

      const chatId = Number(MAIN_CHAT);
      const messageCleaned = cleanMessage(context.message.text);
      const messageAnonymous = createAnonymousMessage(messageCleaned);
      if (messageAnonymous !== "") {
        await bot.telegram.sendMessage(chatId, messageAnonymous);
        const extra = getMessageId(context);
        const { title } = await bot.telegram.getChat(chatId);
        return context.replyWithHTML(
          `<b>message:</b> ${messageAnonymous}\n\n<b>group:</b> ${title}`,
          extra
        );
      }

      return context.replyWithMarkdown("`Please write a message to send`");
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `Send a gossip to main Ebola chat!`,
};
