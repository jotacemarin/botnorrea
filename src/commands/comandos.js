"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials } = require("../utils/telegraf");

module.exports = {
  name: "comandos",
  execute: async ({ context }) => {
    haveCredentials(context);

    try {
      await connect();
      await saveUserModel(context);
    } catch (error) {}

    return context.replyWithMarkdown(
      "*Comandos es un calvo setenta hijueputa!*"
    );
  },
  description: "Comandos es un hijueputa!",
};
