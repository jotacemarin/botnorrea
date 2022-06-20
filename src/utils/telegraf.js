"use strict";

const { BOT_NAME, MAIN_CHAT, DEV_CHAT } = process.env;

const { getKey, setKey } = require("../persistence/redis");

const BOT_REDIS_PREFIX = `${BOT_NAME}`;
const TG_EMPTY_STRING = ".";
const LIST_CHATS = [MAIN_CHAT, DEV_CHAT];
const COMMAND_ENABLED = "1";

const haveCredentials = (context) => {
  const {
    message: {
      from: { first_name, last_name, username },
    },
  } = context;

  if (username) return null;

  if (first_name !== TG_EMPTY_STRING) return null;

  if (last_name !== TG_EMPTY_STRING) return null;

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

module.exports = {
  haveCredentials,
  cleanMessage,
  getMessageId,
  getChatId,
  getNewPermissions,
  setRedis,
  isEnabled,
};
