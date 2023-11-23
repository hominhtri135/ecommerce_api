"use strict";

const express = require("express");
const { authentication } = require("~/auth/authUtils");
const cartController = require("~/controllers/cart.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

// get amount a discount
router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.deleteCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("/", asyncHandler(cartController.listToCart));

// authentication //
router.use(authentication);
////////////////////

// QUERY //

module.exports = router;
