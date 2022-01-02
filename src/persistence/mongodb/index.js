"use strict";

const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;

const mongoose = require("mongoose");
const models = require("./models");

const config = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@botnorrea.rbjit.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;
let connection = null;

const connect = async () => {
  if (connection === null) {
    connection = mongoose.connect(uri, config).then(() => mongoose);
    await connection;
  }

  return connection;
};

module.exports = {
  ...models,
  connect,
};
