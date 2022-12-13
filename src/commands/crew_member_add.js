"use strict";

const {
  connect,
  saveUserModel,
  userModel,
  crewModel,
} = require("../persistence/mongodb");
const {
  haveCredentials,
  getMessageId,
  isEnabled,
} = require("../utils/telegraf");
const { trackCommand } = require("../utils/mixpanel");

const CURRENT_COMMAND = "crew_member_add";

module.exports = {
  name: CURRENT_COMMAND,
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      await isEnabled(CURRENT_COMMAND);
      trackCommand(CURRENT_COMMAND, context);

      const [rawCrewName, ...usernames] = args;
      const crewName = String(rawCrewName).trim().toLowerCase();
      const crew = await crewModel.findOne({ name: crewName }).exec();
      if (!crew) {
        return context.reply(`crew ${crewName} not found!`, extra);
      }

      const $or = usernames.map((rawName) => {
        const username = String(rawName).trim().replace("@", "");
        return { username };
      });
      const users = await userModel.find({ $or }).exec();
      if (users.length === 0) {
        return context.reply("users not found!", extra);
      }

      await crewModel
        .updateOne(
          { _id: crew._id },
          { $push: { members: users.map((user) => user._id) } }
        )
        .exec();

      const usernamesString = users
        .map(({ username }) => `@${username}`)
        .join(" | ");

      return context.reply(
        `crew ${crewName} updated: \n\n[ ${usernamesString} ]`,
        extra
      );
    } catch (error) {
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "(usage: /crew_member_add crew_name username username ...username) Add a new user in one crew",
};
