"use strict";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const { createClient } = require("redis");

let client = null;

const getClient = async () =>
  createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    password: REDIS_PASSWORD,
  });

const connect = async () => {
  if (client === null) {
    client = await getClient();
    await client.connect();
  }

  return client;
};

const disconnect = async () => {
  if (client !== null) {
    await client.quit();
    await client.disconnect();
    client = null;
  }

  return client;
};

const setKey = async (key, value, ttl = 300) => {
  await client.set(key, value);
  if (ttl !== 0) {
    await client.expire(key, ttl);
  }
};

const getKey = async (key) => {
  const value = await client.get(key);
  return value;
};

const delKey = async (key) => {
  await client.del(key);
};

module.exports = {
  connect,
  disconnect,
  setKey,
  getKey,
  delKey,
};
