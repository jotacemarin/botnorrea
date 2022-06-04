"use strict";

const { connect, saveUserModel, saveCrewModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

const disabledCommand = true;

module.exports = {
  name: "newcrew",
  disabled: disabledCommand,
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      if (disabledCommand) {
        return context.reply(`This command disabled temporary!`, extra);
      }

      const name = await saveCrewModel(args);
      return context.reply(`new crew created: ${name}`, extra);
    } catch (error) {
      console.error("command newcrew", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "Create a new crew (usage: `/newcrew crew_name`)",
};
