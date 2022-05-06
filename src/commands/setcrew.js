"use strict";

const {
  connect,
  saveUserModel,
  userModel,
  crewModel,
} = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "setcrew",
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const [rawUsername, ...crewNames] = args;
      const username = String(rawUsername).trim().replace("@", "");
      const user = await userModel.findOne({ username }).exec();
      if (!user) {
        return context.reply("user not found!", extra);
      }

      const $or = crewNames.map((name) => ({ name }));
      const crews = await crewModel.find({ $or }).exec();
      if (crews.length === 0) {
        return context.reply("crews not found!", extra);
      }

      await userModel
        .updateOne(
          { _id: user._id },
          { $push: { crews: { $each: crews.map((crew) => crew._id) } } }
        )
        .exec();

      return context.reply(
        `crews added: ${crewNames.join(", ")} for @${username}`,
        extra
      );
    } catch (error) {
      console.error("command setcrew", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "Set a new crews in user (usage: `/setcrew id crew_name crew_name ...crew_name`)",
};
