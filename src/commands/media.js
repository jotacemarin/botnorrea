"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { searchByTags } = require("../utils/filemanager");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "media";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      const tags = args.map((arg) => arg.toLowerCase());
      const webContentUrl = await searchByTags(tags, true);
      return context.reply(webContentUrl, extra);
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Retrieve a picture if you pass tags",
};
