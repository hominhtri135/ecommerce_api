"use strict";

const express = require("express");
const { apiKey, permission } = require("~/middlewares/checkAuth");
const router = express.Router();

// check apiKey
// router.use(apiKey);

// check permission
// router.use(permission("0000"));

router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/products", require("./product"));
router.use("/v1/api/categories", require("./category"));
router.use("/v1/api", require("./access"));

module.exports = router;
