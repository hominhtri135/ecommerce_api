"use strict";

const express = require("express");
const { authentication } = require("~/middlewares/authUtils");
const inventoryController = require("~/controllers/inventory.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

router.use(authentication);
router.post("/", asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
