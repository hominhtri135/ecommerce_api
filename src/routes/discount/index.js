"use strict";

const express = require("express");
const { authentication, admin } = require("~/middlewares/authUtils");
const discountController = require("~/controllers/discount.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

// get amount a discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/:code_discount",
  asyncHandler(discountController.getAllProductWithDiscountCode)
);

// authentication //
router.use(authentication);
router.use(admin);
////////////////////

router.post("/", asyncHandler(discountController.createDiscountCode));
router.get("/", asyncHandler(discountController.getAllDiscountCodes));

// QUERY //

module.exports = router;
