"use strict";

module.exports = {
  name: "register",
  execute: (context, args) => {
    const { message } = context;
    const { chat } = message;
    const { username, type } = chat;

    if (type !== "private") {
      return context.reply("You can only register in private chat!");
    }
    
    if (!username) {
      return context.reply("You need have a username to register!");
    }

    if (args && args.length) {
      return context.reply(args.join(", "));
    }

    return context.reply("args empty!");
  },
  description: "Register self user to use charged commands",
};
