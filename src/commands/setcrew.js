"use strict";

const {
  connect,
  saveUserModel,
  userModel,
  crewModel,
} = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

const disabledCommand = true;

module.exports = {
  name: "setcrew",
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

      const [rawCrewName, ...usernames] = args;
      const crewName = String(rawCrewName).trim().toLowerCase();
      const crew = await crewModel.findOne({ name: crewName }).exec();
      if (!crew) {
        return context.reply(`crew ${crewName} not found!`, extra);
      }

      const $or = usernames.map((rawName) => {
        const name = String(rawName).trim().replace("@", "");
        return { name };
      });
      const users = await userModel.find({ $or }).exec();
      if (users.length === 0) {
        return context.reply("users not found!", extra);
      }

      await userModel
        .updateMany({ $or }, { $push: { crews: crew._id } })
        .exec();

      const usernamesString = usernames.map((username) => username).join(" | ");

      return context.reply(
        `crew ${crewName} updated: \n\n[ ${usernamesString} ]`,
        extra
      );
    } catch (error) {
      console.error("command setcrew", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "Set a new crews in user (usage: `/setcrew crew_name username username ...username`)",
};
