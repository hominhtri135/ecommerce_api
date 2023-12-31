const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const categoryModel = require("./catetory.model");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";
// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      maxLength: 200,
      unique: true,
      trim: true,
    },
    product_images: {
      type: [
        {
          name: { type: String },
          url: { type: String },
          size: { type: Number },
        },
      ],
      default: [],
    },
    product_description: { type: String, default: "" },
    product_slug: { type: String, unique: true, trim: true },
    product_sku: { type: String, unique: true, trim: true },
    product_price: {
      origin: { type: Number, required: true, default: 0 },
      percent: { type: Number, default: 0 },
      final: { type: Number, required: true, default: 0 },
    },
    product_quantity: { type: Number, default: 0 },
    product_category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    product_ratings: {
      average: {
        type: Number,
        default: 0,
        set: (val) => Math.round(val * 10) / 10,
      },
      total: { type: Number, default: 0 },
      count: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 },
      },
    },
    // product_ratingsAverage: {
    //   type: Number,
    //   default: 5,
    //   min: [1, "Rating must be above 1.0"],
    //   max: [5, "Rating must be above 5.0"],
    //   set: (val) => Math.round(val * 10) / 10,
    // },
    // product_ratingsTotal: { type: Number, default: 0 },
    // product_ratingsCount: {
    //   five: { type: Number, default: 0 },
    //   four: { type: Number, default: 0 },
    //   three: { type: Number, default: 0 },
    //   two: { type: Number, default: 0 },
    //   one: { type: Number, default: 0 },
    // },
    product_variations: {
      type: [
        {
          name: { type: String, required: true },
          sizes: [
            {
              name: { type: String, required: true },
              quantity: {
                type: Number,
                required: true,
                minLength: 0,
              },
            },
          ],
        },
      ],
      default: [],
    },
    product_tags: { type: Array, default: [] },
    product_views: { type: Number, default: 0 },
    // isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() .create() .update()...
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true, locale: "vi" });
  next();
});

productSchema.pre("save", async function (next) {
  // Lấy category ID
  const categoryId = this.product_category;

  // Tăng category_products lên 1
  await categoryModel.updateOne(
    { _id: categoryId },
    { $inc: { category_products: 1 } }
  );

  next();
});

productSchema.pre(
  ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"],
  async function (next) {
    const data = this.getUpdate();
    if (data.product_name) {
      data.product_slug = slugify(data.product_name, {
        lower: true,
        locale: "vi",
      });
    }
    next();
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema);
