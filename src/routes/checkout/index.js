"use strict";

const express = require("express");
const { authentication } = require("~/auth/authUtils");
const checkoutController = require("~/controllers/checkout.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
