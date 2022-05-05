"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");
const { searchByTags } = require("../utils/filemanager");

module.exports = {
  name: "media",
  execute: async ({ context, args }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const tags = args.map((arg) => arg.toLowerCase());
      const webContentUrl = await searchByTags(tags, true);
      return context.reply(webContentUrl);
    } catch (error) {
      console.error("command pic", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: "Retrieve a picture if you pass tags",
};
