"use strict";

const { connect, mediaModel, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");

module.exports = {
  name: "randompic",
  execute: async (context) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const totalMedia = await mediaModel.count({ type: "image" }).exec();
      const randomSkip = Math.floor(Math.random() * totalMedia);
      const { webContentLink } = await mediaModel
        .findOne()
        .skip(randomSkip)
        .exec();

      return context.reply(webContentLink);
    } catch (error) {
      console.error("command randompic", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: "Retrieve a random picture from google drive",
};
