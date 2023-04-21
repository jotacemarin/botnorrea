"use strict";

const { userModel } = require("../persistence/mongodb");
const { haveCredentials, getUser, isEnabled } = require("../utils/telegraf");

const CURRENT_LISTENER = "qr_update";

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
      await isEnabled(CURRENT_LISTENER);

      if (!update?.message?.photo) {
        return context.replyWithMarkdown("`Please attach an image to update your Qr!`");
      }

      const { photo } = update.message;
      const [{ file_id: fileId }] = photo.reverse();

      const user = getUser(update);
      await userModel.updateOne(
        { id: user.id },
        { $set: { ...user, qrPathId: fileId } }
      );
      return context.reply("Qr was updated successfully.");
    } catch (error) {
      const { message } = error;
      console.log(`Qr update error: ${message}`);
      console.log(error);
      context.replyWithMarkdown("`" + message + "`");
      throw error;
    }
  },
  description: `Upload your Qr to get payments!`,
};
