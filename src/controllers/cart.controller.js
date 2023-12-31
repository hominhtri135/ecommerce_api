"use strict";

const { SuccessResponse } = require("~/core/success.response");
const CartService = require("~/services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Cart Success",
      metadata: await CartService.addToCart({
        userId: req.user.userId,
        product: req.body.product,
      }),
    }).send(res);
  };

  // update + -
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Cart Success",
      metadata: await CartService.updateCart({
        userId: req.user.userId,
        product: req.body.product,
      }),
    }).send(res);
  };

  // delete
  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Cart Success",
      metadata: await CartService.deleteItemUserCart({
        userId: req.user.userId,
        product: req.body.product,
      }),
    }).send(res);
  };

  // list items cart
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Cart Success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
