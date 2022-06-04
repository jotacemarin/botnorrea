"use strict";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const { createClient } = require("redis");

const getClient = async () =>
  createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    password: REDIS_PASSWORD,
  });

const setKey = async (key, value, ttl = 300) => {
  const client = await getClient();
  await client.connect();
  await client.set(key, value);
  await client.expire(key, ttl);
  await client.quit();
};

const getKey = async (key) => {
  const client = await getClient();
  await client.connect();
  const value = await client.get(key);
  await client.quit();
  return value;
};

const delKey = async (key) => {
  const client = await getClient();
  await client.connect();
  await client.del(key);
  await client.quit();
};

module.exports = {
  setKey,
  getKey,
  delKey,
};
