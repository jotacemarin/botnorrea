"use strict";

const { BOT_NAME, MAIN_CHAT } = process.env;

const { getKey, setKey } = require("../persistence/redis");

const TELEGRAM_HTTP_API = "https://api.telegram.org/file/";
const BOT_REDIS_PREFIX = `${BOT_NAME}`;
const BOT_PROVIDER_PREFIX = "providers";
const LIST_CHATS = [MAIN_CHAT];
const COMMAND_ENABLED = "1";
const MAX_CALLS = 5;

const haveCredentials = (context) => {
  const { message, edited_message } = context;
  const {
    from: { first_name, last_name, username },
  } = message ?? edited_message;

  if (username) return null;

  if (first_name) return null;

  if (last_name) return null;

  throw new Error(
    "`Please set a *first name*, *last name* or *username* in your telegram account to use botnorrea!`"
  );
};

const cleanMessage = (message) => {
  const cleanedMessage = String(message)
    .trim()
    .replace("/gossip", "")
    .replace("@botnorrea_bot", "");

  return cleanedMessage;
};

const getUser = (context) => {
  const {
    message: { from },
  } = context;
  const { id, username, first_name, last_name } = from;

  return {
    id,
    firstname: first_name,
    lastname: last_name,
    username,
  };
};

const getMessageId = (context) => {
  try {
    const {
      message: { message_id },
    } = context;
    return { reply_to_message_id: message_id };
  } catch (error) {
    return {};
  }
};

const getChatId = (context) => {
  const {
    message: {
      chat: { id },
    },
  } = context;

  if (!LIST_CHATS.includes(String(id))) {
    throw new Error(
      `This group is not configured for @botnorrea_bot, please contact with Admin`
    );
  }

  return id;
};

const getNewPermissions = (enabled = true) => ({
  can_add_web_page_previews: enabled,
  can_change_info: enabled,
  can_invite_users: enabled,
  can_pin_messages: enabled,
  can_send_media_messages: enabled,
  can_send_messages: enabled,
  can_send_other_messages: enabled,
  can_send_polls: enabled,
});

const setRedis = async (command) => {
  const botCommand = `${BOT_REDIS_PREFIX}:${command}`;
  const current = await getKey(botCommand);
  if (!current) {
    await setKey(botCommand, COMMAND_ENABLED, 0);
  }
};

const isEnabled = async (command) => {
  const botCommand = `${BOT_REDIS_PREFIX}:${command}`;
  const current = await getKey(botCommand);

  if (current !== COMMAND_ENABLED) {
    throw new Error("This command disabled temporary!");
  }

  return null;
};

const providerIsEnabled = async (provider) => {
  if (provider === "") {
    throw new Error("Provider must necessary!");
  }

  const externalProviderKey = `${BOT_REDIS_PREFIX}:${BOT_PROVIDER_PREFIX}:${provider}`;
  const current = await getKey(externalProviderKey);

  if (!current) {
    throw new Error(`${provider} was not found!`);
  }

  if (isNaN(current)) {
    throw new Error(`Botnorrea internal error!`);
  }

  const currentFormatted = Number(current);
  if (currentFormatted > MAX_CALLS) {
    throw new Error(`${provider} reached the maximum calls to webhook!`);
  }

  await setKey(externalProviderKey, currentFormatted + 1, 0);

  return null;
};

module.exports = {
  haveCredentials,
  cleanMessage,
  getUser,
  getMessageId,
  getChatId,
  getNewPermissions,
  setRedis,
  isEnabled,
  providerIsEnabled,
};
