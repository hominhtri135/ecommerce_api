"use strict";

const { model, Schema, Types } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "categories";

// Declare the Schema of the Mongo model
var categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
      unique: true,
    },
    category_slug: { type: String, unique: true, trim: true },
    category_description: { type: String, default: "" },
    category_images: { type: Array, default: [] },
    category_products: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// categorySchema.set("toObject", {
//   transform: function (doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//   },
// });

categorySchema.pre("save", function (next) {
  this.category_slug = slugify(this.category_name, {
    lower: true,
    locale: "vi",
  });
  next();
});

categorySchema.pre(
  ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"],
  async function (next) {
    const data = this.getUpdate();
    if (data.category_name) {
      data.category_slug = slugify(data.category_name, {
        lower: true,
        locale: "vi",
      });
    }
    next();
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema);
