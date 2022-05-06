"use strict";

const TG_EMPTY_STRING = ".";

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
    const { message: { message_id } } = context;
    return { reply_to_message_id: message_id };
  } catch (error) {
    return {};
  }
};

module.exports = {
  haveCredentials,
  cleanMessage,
  getMessageId,
};
