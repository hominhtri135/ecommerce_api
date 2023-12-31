"use strict";

const dev = {
  db: {
    port: process.env.DEV_DB_PORT || "6379",
    host: process.env.DEV_DB_HOST || "127.0.0.1",
  },
};

const pro = {
  db: {
    port: process.env.DEV_DB_PORT || "6379",
    host: process.env.DEV_DB_HOST || "127.0.0.1",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

console.log(config[env], env);
module.exports = config[env];
