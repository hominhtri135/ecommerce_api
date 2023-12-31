"use strict";

const { SuccessResponse } = require("~/core/success.response");
const CheckoutService = require("~/services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Checkout Review Success",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
  orderByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Order Success",
      metadata: await CheckoutService.orderByUser({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
