"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");
const { deprecatedMessage } = require("../utils/deprecated");

const deprecated = deprecatedMessage("media");

module.exports = {
  name: "pic",
  execute: async ({ context }) => {
    try {
      haveCredentials(context);

      await connect();
      await saveUserModel(context);

      return context.replyWithMarkdown(deprecated);
    } catch (error) {
      console.error("command pic", error);
      const { message } = error;
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `${deprecated} *BETA:* retrieve a picture if you pass tags`,
};
