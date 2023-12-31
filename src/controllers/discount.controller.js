"use strict";

const { SuccessResponse } = require("~/core/success.response");
const DiscountService = require("~/services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Discount Code Success",
      metadata: await DiscountService.createDiscountCode(req.body),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list discount success",
      metadata: await DiscountService.getAllDiscountCodes(req.query),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get amount discount with product success",
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  };

  getAllProductWithDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list products with discount code success",
      metadata: await DiscountService.getAllProductWithDiscountCode({
        ...req.query,
        code: req.params.code_discount,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
