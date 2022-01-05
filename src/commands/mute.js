"use strict";

module.exports = {
  name: "mute",
  execute: (context, args) => {
    try {
      console.log("context", context);
      console.log("context stringify", JSON.stringify(context));
    } catch (error) {
      console.error(error.message);
      console.error(error);
    }

    return null;
  },
  description: "Register self user to use charged commands",
};
