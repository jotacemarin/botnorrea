"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { getRandom } = require("../utils/filemanager");

const CURRENT_COMMAND = "randommedia";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);

      const response = await getRandom();
      return context.reply(response, extra);
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Retrieve a random picture from file manager",
};
