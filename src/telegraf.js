"use strict";

const { TELEGRAM_TOKEN } = process.env;

const fs = require("fs");
const { Telegraf } = require("telegraf");

const BOT_PREFIX = "/";
const COMMAND_POSITION = 0;

const initBot = () => {
  if (!TELEGRAM_TOKEN) throw new Error("Telegram Bot token not found!");

  const options = {
    telegram: { webhookReply: true },
  };
  const bot = new Telegraf(TELEGRAM_TOKEN, options);

  return bot;
};

const setWebhook = async (url) => {
  const bot = initBot();
  await bot.telegram.setWebhook(url);
};

const loadCommands = (bot) => {
  const commandFiles = fs
    .readdirSync(`${__dirname}/commands`)
    .filter((file) => file.endsWith(".js"));

  const commands = commandFiles.map((commandFile) => {
    const commandScript = require(`./commands/${commandFile}`);
    const { name, description } = commandScript;

    const command = `${BOT_PREFIX}${commandScript.name}`;
    const execute = async (context) => {
      try {
        const { message } = context;
        const args = message.text
          .trim()
          .split(" ")
          .filter((_, index) => index > COMMAND_POSITION);

        const params = { context, args, bot };
        await commandScript.execute(params);
      } catch (error) {
        console.error(`${error.message}; ${command}`);
      }
    };

    bot.command(command, execute);

    return { command: name, description };
  });

  return commands;
};

const buildHelp = (bot, commands = []) => {
  try {
    const helpText = commands
      .map(({ command, description }) => `/${command} - ${description}`)
      .join("\n");
    bot.help((context) => context.replyWithMarkdown(helpText));
  } catch (error) {
    console.error("buildHelp help: ", error);
  }
};

const handleUpdate = async (body) => {
  const bot = initBot();
  const commands = loadCommands(bot);
  buildHelp(bot, commands);
  await bot.handleUpdate(body);
};

module.exports = {
  setWebhook,
  handleUpdate,
  loadCommands,
};
