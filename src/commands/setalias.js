"use strict";

const { connect, userModel, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "setalias",
  execute: async ({ context, args }) => {
    const extra = getMessageId(context);

    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const [_id, ...tags] = args;
      const user = await userModel.findOne({ _id }).exec();
      if (!user) {
        return context.reply("user not found!", extra);
      }

      const { aliases: originalAliases, firstname, lastname } = user;
      const filteredAliases = tags
        .map((tag) => tag.toLowerCase())
        .filter((tag) => tag.trim() !== "")
        .filter((tag) => !originalAliases.includes(tag));

      if (!filteredAliases.length) {
        return context.reply("no new aliases for user file!", extra);
      }

      await userModel
        .updateOne({ _id }, { $push: { aliases: { $each: filteredAliases } } })
        .exec();

      const fullName = `${firstname} ${lastname}`;
      const aliasesAdded = filteredAliases.join(", ");
      return context.reply(
        `alias added: ${aliasesAdded} for ${fullName}`,
        extra
      );
    } catch (error) {
      console.error("command setalias", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`", extra);
    }
  },
  description:
    "Set a new aliases in user (usage: `/setalias id alias alias ...alias`)",
};
