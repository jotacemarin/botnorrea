"use strict";

const { saveUserModel, crewModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "crews";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      const crews = await crewModel.find({}).exec();
      if (crews.length === 0) {
        return context.reply("crews not found!", extra);
      }

      const crewsNames = crews.map(({ name }) => `${name}`).join("\n");
      return context.replyWithMarkdown(`*crews*: \n\n${crewsNames}`, extra);
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "List all crews",
};
