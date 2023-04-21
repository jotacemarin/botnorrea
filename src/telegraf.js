"use strict";

const { TELEGRAM_TOKEN, MAIN_CHAT } = process.env;

const fs = require("fs");
const { Telegraf } = require("telegraf");
const {
  cleanMessage,
  setRedis,
  providerIsEnabled,
} = require("./utils/telegraf");

const BOT_COMMAND_PREFIX = "/";
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
    const { name, description, disabled } = commandScript;

    const command = `${BOT_COMMAND_PREFIX}${commandScript.name}`;
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
        console.error(`${error.message}; command: ${command}`);
      }
    };

    bot.command(command, execute);

    return { command: name, description, disabled };
  });

  return commands;
};

const loadMediaListeners = (bot) => {
  const triggerListener = require(`./media_listeners/index.js`);
  const execute = async (context) => {
    try {
      const { update } = context;
      const caption = update?.message?.caption ?? "";
      const args = caption.trim().split(" ");
      await triggerListener({ context, args, bot });
    } catch (error) {
      console.error(`loadMediaListeners: ${error.message}`);
    }
  };
  bot.on(["photo", "video"], execute);
};

const buildHelp = (bot, commands = []) => {
  try {
    const helpText = commands
      .map(({ command, description }) => `/${command} - ${description}`)
      .join("\n");
    bot.help((context) => context.reply(helpText));
  } catch (error) {
    console.error("buildHelp help: ", error);
  }
};

const buildRedis = async (commands = []) => {
  commands.forEach(async ({ command }) => await setRedis(`${command}`));
};

const handleUpdate = async (body) => {
  const bot = initBot();
  const commands = loadCommands(bot);
  loadMediaListeners(bot);
  buildHelp(bot, commands);
  buildRedis(commands);
  await bot.handleUpdate(body);
};

const externalWebhook = async (body) => {
  await providerIsEnabled(body.Authorization ?? body.authorization ?? "");

  const bot = initBot();

  const chatId = Number(MAIN_CHAT);
  const rawMessage = cleanMessage(body.message);
  if (rawMessage === "") {
    throw new Error("Please write a message to send");
  }

  return bot.telegram.sendMessage(chatId, rawMessage);
};

module.exports = {
  setWebhook,
  handleUpdate,
  loadCommands,
  externalWebhook,
};
