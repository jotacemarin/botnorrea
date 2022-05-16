"use strict";

const { MAIN_CHAT } = process.env;

const moment = require("moment");

const timeInMinutes = 15;

const { connect, saveUserModel, userModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  getChatId,
  getNewPermissions
} = require("../utils/telegraf");

module.exports = {
  name: "unmute",
  execute: async ({ context, args, bot }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const chatId = getChatId(context);

      if (chatId === Number(MAIN_CHAT)) {
        return context.reply("Not available here!", extra);
      }

      const [rawUsername] = args;
      const username = String(rawUsername).trim().replace("@", "");
      const user = await userModel.findOne({ username }).exec();
      if (!user) {
        return context.reply("user not found!", extra);
      }

      const { id: mongoUserId } = user;
      const permissions = getNewPermissions();
      const extraRestrict = { permissions };

      await bot.telegram.restrictChatMember(chatId, mongoUserId, extraRestrict);
      return context.reply(`${rawUsername} unmuted!`, extra);
    } catch (error) {
      console.error("command unmute", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Unmute user",
};
