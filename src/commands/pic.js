"use strict";

const { connect, mediaModel } = require("../persistence/mongodb");

module.exports = {
  name: "pic",
  execute: async (context, tags) => {
    try {
      await connect();

      const filters = { tags: { $in: tags } };

      const total = await mediaModel.count(filters).exec();
      if (!total) {
        return context.reply("media file not found!");
      }

      const randomSkip = Math.floor(Math.random() * total);
      const { webContentLink } = await mediaModel
        .findOne(filters)
        .skip(randomSkip)
        .exec();

      return context.reply(webContentLink);
    } catch (error) {
      console.error("command ping", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `*BETA* retrieve a picture if you pass the google key as param`,
};
