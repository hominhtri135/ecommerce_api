"use strict";

const { Types } = require("mongoose");
const { inventory } = require("../inventory.model");
const { convertToObjectIdMongodb } = require("~/utils");
const productModel = require("../product.model");

const insertInventory = async ({ productId, shopId, stock, location }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, select }) => {
  const filter = {
    _id: convertToObjectIdMongodb(productId), // ID sản phẩm
    product_variations: {
      $elemMatch: {
        name: select.color,
        sizes: {
          $elemMatch: {
            name: select.size,
            quantity: { $gte: select.quantity },
          },
        },
      },
    },
  };

  const update = {
    $inc: {
      "product_variations.$[i].sizes.$[j].quantity": -select.quantity,
    },
  };

  const option = {
    arrayFilters: [
      {
        "i.name": select.color,
      },
      {
        "j.name": select.size,
      },
    ],
  };

  // Cập nhật số lượng
  return await productModel.updateOne(filter, update, option);
};

const refundInventory = async ({ productId, select }) => {
  const filter = {
    _id: convertToObjectIdMongodb(productId), // ID sản phẩm
  };

  const update = {
    $inc: {
      "product_variations.$[i].sizes.$[j].quantity": select.quantity,
    },
  };

  const option = {
    arrayFilters: [
      {
        "i.name": select.color,
      },
      {
        "j.name": select.size,
      },
    ],
  };

  // Cập nhật số lượng
  return await productModel.updateOne(filter, update, option);
};

module.exports = { insertInventory, reservationInventory, refundInventory };
