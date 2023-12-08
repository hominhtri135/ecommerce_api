"use strict";

const { Types } = require("mongoose");
const { inventory } = require("../inventory.model");
const { convertToObjectIdMongodb } = require("~/utils");

const insertInventory = async ({ productId, shopId, stock, location }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return inventory.updateOne(query, updateSet, options);
};

module.exports = { insertInventory, reservationInventory };
