"use strict";

const { connect, userModel, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");

module.exports = {
  name: "setalias",
  execute: async (context, args) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      const [_id, ...tags] = args;
      const user = await userModel.findOne({ _id }).exec();
      if (!user) {
        return context.reply("user not found!");
      }

      const { aliases: originalAliases, firstname, lastname } = user;
      const filteredAliases = tags
        .map((tag) => tag.toLowerCase())
        .filter((tag) => tag.trim() !== "")
        .filter((tag) => !originalAliases.includes(tag));

      if (!filteredAliases.length) {
        return context.reply("no new aliases for user file!");
      }

      await userModel
        .updateOne({ _id }, { $push: { aliases: { $each: filteredAliases } } })
        .exec();

      const fullName = `${firstname} ${lastname}`;
      const aliasesAdded = filteredAliases.join(", ");
      return context.reply(`alias added: ${aliasesAdded} for ${fullName}`);
    } catch (error) {
      console.error("command setalias", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description:
    "*BETA:* Set a new aliases in user (usage: `/setalias id tag tag ...tag`)",
};