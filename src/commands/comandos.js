"use strict";

const { connect, saveUserModel } = require("../persistence/mongodb");
const { haveCredentials, getMessageId } = require("../utils/telegraf");

module.exports = {
  name: "comandos",
  execute: async ({ context }) => {
    haveCredentials(context);

    try {
      await connect();
      await saveUserModel(context);
    } catch (error) {}
    
    const extra = getMessageId(context);
    return context.replyWithMarkdown(
      "*Comandos es un calvo setenta hijueputa!*",
      extra
    );
  },
  description: "Comandos es un hijueputa!",
};
