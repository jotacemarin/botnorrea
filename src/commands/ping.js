"use strict";

module.exports = {
  name: "ping",
  execute: (context) => context.replyWithMarkdown("*Pong!*"),
  description: `Only respond *Pong!*`,
};
