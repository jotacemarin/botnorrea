"use strict";

const {
  connect,
  saveUserModel,
  userModel,
  crewModel,
} = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "crew",
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const [crewName] = args;
      const crew = await crewModel.findOne({ name: crewName }).exec();
      if (!crew) {
        return context.reply("crew not found!", extra);
      }
      const { members } = crew;
      if (!members || members.length === 0) {
        return context.reply("members not found!", extra);
      }

      const usernames = members
        .map(({ username }) => `@${username}`)
        .join(" | ");
      return context.reply(`${crewName}: \n\n[ ${usernames} ]`, extra);
    } catch (error) {
      console.error("command crew", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description: "Invoke a crews members (usage: `/crew crew_name`)",
};
