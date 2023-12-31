"use strict";

const { convertToObjectIdMongodb } = require("~/utils");
const { cart } = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = {
      cart_userId: convertToObjectIdMongodb(userId),
      cart_state: "active",
    },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const addProductCart = async ({ userId, product }) => {
  const { productId, select } = product;
  const findProduct = cart
    .findOne({
      cart_userId: convertToObjectIdMongodb(userId),
      cart_state: "active",
      "cart_products.productId": productId,
      "cart_products.$.select.color": select.color,
      "cart_products.$.select.size": select.size,
    })
    .lean();

  const query = {
      cart_userId: convertToObjectIdMongodb(userId),
      cart_state: "active",
    },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, select } = product;

  const findProduct = await cart.findOne({
    cart_userId: convertToObjectIdMongodb(userId),
    "cart_products.productId": productId,
    cart_state: "active",
  });

  if (findProduct) {
    const query = {
        cart_userId: convertToObjectIdMongodb(userId),
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        // $inc: { "cart_products.$.select.quantity": select.quantity },
        "cart_products.$.select.quantity": select.quantity,
        "cart_products.$.select.color": select.color,
        "cart_products.$.select.size": select.size,
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  return await createUserCart({ userId, product });
};

const findCartById = async ({ cartId }) => {
  return await cart
    .findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: "active" })
    .lean();
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  findCartById,
};
