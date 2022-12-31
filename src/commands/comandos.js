"use strict";

const { saveUserModel } = require("../persistence/mongodb");
const { getMessageId, isEnabled } = require("../utils/telegraf");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "comandos";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      return context.replyWithMarkdown(
        "*Comandos es un calvo setenta hijueputa!*",
        extra
      );
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Comandos es un hijueputa!",
};
