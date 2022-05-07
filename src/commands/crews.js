"use strict";

const {
  connect,
  saveUserModel,
  userModel,
  crewModel,
} = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "crews",
  execute: async ({ context }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

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
