"use strict";

const {
  connect,
  saveUserModel,
  saveCrewModel,
} = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "newcrew";

module.exports = {
  name: CURRENT_COMMAND,
  disabled: true,
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      const name = await saveCrewModel(args);
      return context.reply(`new crew created: ${name}`, extra);
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Create a new crew (usage: `/newcrew crew_name`)",
};
