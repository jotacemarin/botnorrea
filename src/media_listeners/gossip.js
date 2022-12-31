"use strict";

const { MAIN_CHAT } = process.env;

const { saveUserModel } = require("../persistence/mongodb");
const {
  haveCredentials,
  cleanMessage,
  isEnabled,
} = require("../utils/telegraf");
const { uploadPic } = require("../utils/freeimage");

const CURRENT_LISTENER = "gossip";

module.exports = {
  name: CURRENT_LISTENER,
  execute: async ({ context, args, bot }) => {
    try {
      const { update } = context;
      const [command] = args;
      if (command !== `/${CURRENT_LISTENER}`) {
        return;
      }

      haveCredentials(update);

      await saveUserModel(update);

      await isEnabled(CURRENT_LISTENER);

      const chatId = Number(MAIN_CHAT);
      const { caption, photo, video } = update.message;

      const textMessage = caption ? cleanMessage(caption) : "";

      if (photo) {
        const [{ file_id }] = photo.reverse();
        const { href: media } = await bot.telegram.getFileLink(file_id);
        const url = await uploadPic(media);
        return bot.telegram.sendPhoto(chatId, url, { caption: textMessage });
      }

      if (video && false) {
        const { file_id } = video;
        const { href: media } = await bot.telegram.getFileLink(file_id);
        return bot.telegram.sendVideo(chatId, media, textMessage);
      }

      return context.replyWithMarkdown("`Please write a message to send`");
    } catch (error) {
      const { message } = error;
      console.log(`gossip error: ${message}`);
      console.log(error);
      return context.replyWithMarkdown("`" + message + "`");
    }
  },
  description: `Send a gossip to main Ebola chat!`,
};
