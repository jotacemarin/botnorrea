"use strict";

const {
  connect,
  saveUserModel,
  crewModel,
} = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

const disabledCommand = true;

module.exports = {
  name: "crews",
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      if (disabledCommand) {
        return context.reply(`This command disabled temporary!`, extra);
      }

      const crews = await crewModel.find({}).exec();
      if (crews.length === 0) {
        return context.reply("crews not found!", extra);
      }

      const crewsNames = crews.map(({ name }) => `${name}`).join("\n");
      return context.replyWithMarkdown(`*crews*: \n\n${crewsNames}`, extra);
    } catch (error) {
      console.error("command crews", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "List all crews",
};
