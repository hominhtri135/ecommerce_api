"use strict";

const express = require("express");
const { apiKey, permission } = require("~/middlewares/checkAuth");
const { promisify } = require("util");
const router = express.Router();
const asyncHandler = require("~/helpers/asyncHandler");

const redis = require("redis");
const redisClient = redis.createClient(6379);

// router.use(
//   "/",
//   asyncHandler(async (req, res) => {
//     await redisClient.connect();
//     const order = [
//       {
//         productId: 1,
//         price: 50000,
//       },
//       {
//         productId: 2,
//         price: 20000,
//       },
//     ];

//     const result = await redisClient.get("ordersystem");
//     await redisClient.disconnect();
//     res.status(200).json({
//       msg: "Connected",
//       metadata: result,
//     });
//   })
// );

// check apiKey
// router.use(apiKey);

// check permission
// router.use(permission("0000"));

router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access"));

module.exports = router;
