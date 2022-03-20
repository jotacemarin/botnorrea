"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");
const { deprecatedMessage } = require("../utils/deprecated");

const deprecated = deprecatedMessage("randommedia");

module.exports = {
  name: "randompic",
  execute: async ({ context }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      return context.replyWithMarkdown(deprecated);
    } catch (error) {
      console.error("command randompic", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `${deprecated} Retrieve a random picture from google drive`,
};
