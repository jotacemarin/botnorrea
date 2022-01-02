const mongodb = require("./mongodb");
const gdrive = require("./gdrive");

module.exports = {
  ...mongodb,
  ...gdrive,
};
