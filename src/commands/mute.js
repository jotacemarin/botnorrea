"use strict";

const { MAIN_CHAT } = process.env;

const moment = require("moment");
const { connect, saveUserModel, userModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  getChatId,
  getNewPermissions,
  isEnabled,
} = require("../utils/telegraf");

const CURRENT_COMMAND = "mute";
const timeInMinutes = 15;

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, args, bot }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const chatId = getChatId(context);

      await isEnabled(CURRENT_COMMAND);

      const [rawUsername] = args;
      const username = String(rawUsername).trim().replace("@", "");
      const user = await userModel.findOne({ username }).exec();
      if (!user) {
        return context.reply("user not found!", extra);
      }

      const { id: mongoUserId } = user;

      const admins = await context.getChatAdministrators();
      const isAdmin = [...admins].some(
        ({ user: { id: tgUserId } }) => mongoUserId === String(tgUserId)
      );

      if (isAdmin) {
        return context.reply(`${rawUsername} is admin 😎`, extra);
      }

      const until_date = moment().add(timeInMinutes, "minutes").unix();
      const permissions = getNewPermissions(false);
      const extraRestrict = { permissions, until_date };

      await bot.telegram.restrictChatMember(chatId, mongoUserId, extraRestrict);
      return context.reply(
        `${rawUsername} muted for ${timeInMinutes} minutes!`,
        extra
      );
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Mute user for 15 minutes",
};
