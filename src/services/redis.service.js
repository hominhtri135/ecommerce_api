"use strict";

const { promisify } = require("util");
const {
  reservationInventory,
} = require("~/models/repositories/inventory.repo");

const redisClient = require("~/dbs/init.redis");

// const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, select) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3; // 3 seconds tam lock

  for (let i = 0; i < retryTimes; i++) {
    // tao mot key, ai nam giu thi duoc vao thanh toan
    const result = await redisClient.set(key, "", {
      EX: expireTime,
      NX: true,
    });
    console.log(`resultRedis:::`, result);

    if (result === "OK") {
      // thao tac voi inventory
      const isReversation = await reservationInventory({
        productId,
        select,
      });
      console.log({ isReversation });
      // const isReversation = { modifiedCount: 1 };

      // thao tac thanh cong
      if (isReversation.modifiedCount) {
        // hoan tra lai key
        await redisClient.pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
