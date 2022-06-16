"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");

const CURRENT_COMMAND = "comandos";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);

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
