"use strict";

const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping: { type: Object, default: {} },
    /*
        street,
        city,
        state,
        country
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: "#0000122112023" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  order: model(DOCUMENT_NAME, orderSchema),
};
