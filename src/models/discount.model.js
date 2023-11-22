"use strict";

const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage,
    discount_value: { type: Number, required: true }, // 10.000đ or 10%
    discount_code: { type: String, required: true }, // discount code
    discount_start_date: { type: Date, required: true }, // ngay bat dau
    discount_end_date: { type: Date, required: true }, // ngay ket thuc
    discount_max_uses: { type: Number, required: true }, // so luong discount duoc su dung
    discount_uses_count: { type: Number, required: true }, // so discount da duoc su dung
    discount_user_used: { type: Array, default: [] }, // ai da su dung
    discount_max_uses_per_user: { type: Number, required: true }, // so luong cho phep toi da duoc su dung moi user
    discount_min_order_value: { type: Number, required: true }, // gia tri don hang toi thieu duoc ap dung discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham duoc ap dung
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
