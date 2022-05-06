"use strict";

const media = require("./media.model");
const user = require("./user.model");
const crew = require("./crew.model");

module.exports = {
  ...media,
  ...user,
  ...crew,
};
