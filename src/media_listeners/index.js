"use strict";

const fs = require("fs");

module.exports = async ({ context, args, bot }) => {
  try {
    const [command] = args;

    if (!String(command).charAt(0).includes("/")) {
      return null;
    }

    const file = fs
      .readdirSync(`${__dirname}`)
      .find((file) => `/${file}`.includes(command));
    if (!file) {
      return null;
    }

    const commandScript = require(`.${command}.js`);
    await commandScript.execute({ context, args, bot });
  } catch (error) {
    const { message } = error;
    console.log(`gossip error: ${message}`);
    console.log(error);
    return context.replyWithMarkdown("`" + message + "`");
  }
};
