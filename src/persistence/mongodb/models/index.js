"use strict";

const mediaModel = require("./media.model");
const userModel = require("./user.model");

const saveUserModel = async (context) => {
  try {
    const {
      message: { from },
    } = context;
    const { username, first_name, last_name } = from;

    const user = {
      firstname: first_name,
      lastname: last_name,
    };

    if (username) {
      user["username"] = username;
    }

    await userModel.create(user);
  } catch (error) {
    const { message } = error;
    console.error("saveUserModel", message);
  }
};

module.exports = {
  mediaModel,
  userModel,
  saveUserModel,
};
