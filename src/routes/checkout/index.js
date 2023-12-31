"use strict";

const express = require("express");
const { authentication } = require("~/middlewares/authUtils");
const checkoutController = require("~/controllers/checkout.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

router.use(authentication);
router.post("/review", asyncHandler(checkoutController.checkoutReview));
router.post("/order", asyncHandler(checkoutController.orderByUser));

module.exports = router;
