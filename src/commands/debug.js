"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "debug";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      const { update, botInfo } = context;

      const extra = getMessageId(context);
      const message = "`" + JSON.stringify({ update, botInfo }, null, 2) + "`";
      return context.replyWithMarkdown(message, extra);
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: "Helper developer command",
};
