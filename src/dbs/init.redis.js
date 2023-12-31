const { createClient } = require("redis");

const {
  db: { port, host },
} = require("~/configs/config.redis");

const redisClient = createClient({ port, host });

redisClient.on("connect", () => {
  console.log(`Redis client connected`);
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("error", (error) => {
  console.error(error);
});

redisClient.connect();

module.exports = redisClient;
