"use strict";

const {
  saveUserModel,
  userModel,
} = require("../persistence/mongodb");
const { getMessageId, isEnabled } = require("../utils/telegraf");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "qr";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      const [rawUsername] = args;
      const username = String(rawUsername).trim().replace("@", "");
      const user = await userModel.findOne({ username }).exec();
      if (!user) {
        return context.reply("user not found!", extra);
      }

      const { qrPathId } = user;
      if (!qrPathId) {
        return context.reply(`${rawUsername} does not have Qr setting up!`, extra);  
      }

      return context.replyWithPhoto(qrPathId, extra);
    } catch (error) {
      const { message } = error;
      context.replyWithMarkdown("`" + message + "`", extra);
      throw error;
    }
  },
  description: "Get a Qr from the member that you mention to send payments!",
};
