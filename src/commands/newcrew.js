"use strict";

const { connect, saveUserModel, saveCrewModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "newcrew",
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const name = await saveCrewModel(args);
      return context.reply(`new crew created: ${name}`, extra);
    } catch (error) {
      console.error("command newcrew", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "Create a new crew (usage: `/newcrew name`)",
};
