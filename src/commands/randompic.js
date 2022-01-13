"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");
const { getRandom } = require("../utils/filemanager");

module.exports = {
  name: "randompic",
  execute: async (context) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const webContentUrl = await getRandom();

      return context.reply(webContentUrl);
    } catch (error) {
      console.error("command randompic", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: "Retrieve a random picture from google drive",
};
