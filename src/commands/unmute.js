"use strict";

const { connect, saveUserModel, userModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  getChatId,
  getNewPermissions,
  isEnabled,
} = require("../utils/telegraf");

const CURRENT_COMMAND = "unmute";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, args, bot }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);

      const chatId = getChatId(context);

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
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Unmute user",
};
