"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");
const { getRandom } = require("../utils/filemanager");

module.exports = {
  name: "randommedia",
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const response = await getRandom();
      return context.reply(response, extra);
    } catch (error) {
      console.error("command randompic", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Retrieve a random picture from file manager",
};
