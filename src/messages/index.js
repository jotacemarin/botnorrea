"use strict";

const { saveUserScore, saveUserModel } = require("../persistence/mongodb");

const TYPE_BOT_COMMAND = "bot_command";

module.exports = async (context) => {
  try {
    const { message } = context;
    const { entities = [], text = "" } = message;
    
    const isCommand = entities.some(({ type }) => type === TYPE_BOT_COMMAND);
    if (isCommand) {
      return null;
    }
    await saveUserModel(context);

    const score = String(text).split(" ").length;
    await saveUserScore(context, score);
  } catch (error) {
    console.error("on: ", error);
  }
};
