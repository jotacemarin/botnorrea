"use strict";

module.exports = async ({ context, args, bot }) => {
  try {
    const [command] = args;
    const commandScript = require(`.${command}.js`);
    await commandScript.execute({ context, args, bot });
  } catch (error) {
    const { message } = error;
    console.log(`gossip error: ${message}`);
    console.log(error);
    return context.replyWithMarkdown("`" + message + "`");
  }
};
