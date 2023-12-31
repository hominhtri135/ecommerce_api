"use strict";

const express = require("express");
const { authentication } = require("~/middlewares/authUtils");
const cartController = require("~/controllers/cart.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

// authentication //
router.use(authentication);
////////////////////

// get amount a discount
router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.deleteCart));
router.patch("/", asyncHandler(cartController.updateCart));
router.get("/", asyncHandler(cartController.listToCart));

// QUERY //

module.exports = router;
