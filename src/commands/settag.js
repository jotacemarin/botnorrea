"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");
const { setTags } = require("../utils/filemanager");

module.exports = {
  name: "settag",
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const [webContentLink, ...tags] = args;
      const response = await setTags(webContentLink, tags);
      return context.reply(response, extra);
    } catch (error) {
      console.error("command settag", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "Set a new tags in media file to next finds using command `/pic` (usage: `/settag ulr_image tag tag ...tag`)",
};
