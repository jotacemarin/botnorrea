"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { setTags } = require("../utils/filemanager");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "settag";

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

      const [webContentLink, ...tags] = args;
      const response = await setTags(webContentLink, tags);
      return context.reply(response, extra);
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "(usage: /settag ulr_image tag tag ...tag) Set a new tags in media file to next finds using command /media",
};
