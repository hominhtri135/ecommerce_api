"use strict";

const { BadRequestError } = require("~/core/error.response");
const productModel = require("~/models/product.model");
const { insertInventory } = require("~/models/repositories/inventory.repo");
const {
  findAllDraft,
  togglePublishProduct,
  findAllPublish,
  searchProductByUser,
  findAllProducts,
  getProductById,
  updateProductById,
  getAllProductsAdmin,
  getProductBySlugOrId,
  updateProductBySlugOrId,
  getProductByCategoryId,
} = require("~/models/repositories/product.repo");
const {
  removeUndefinedObject,
  updateNestedObjectParser,
  validateRequiredFields,
  getUnSelectData,
} = require("~/utils");

//define Factory class t o create product
class ProductService {
  static async createProduct(payload) {
    const objectPayload = removeUndefinedObject(payload);
    const {
      product_name,
      product_price,
      product_category,
      product_variations,
    } = objectPayload;

    validateRequiredFields({
      product_name,
      product_price,
      product_category,
      product_variations,
    });

    const holderProduct = await productModel.findOne({ product_name }).lean();
    if (holderProduct) {
      throw new BadRequestError("Product already exists!");
    }

    const newProduct = await productModel.create(objectPayload);
    return newProduct;
  }

  static async updateProductById(product_id, payload) {
    const holderProduct = await getProductById({ product_id });
    if (!holderProduct) {
      throw new NotFoundError("Product not found!");
    }
    const objectPayload = removeUndefinedObject(payload);

    const updateProduct = await updateProductById({
      product_id,
      payload: updateNestedObjectParser(objectPayload),
      unSelect: ["__v"],
    });
    return updateProduct;
  }

  static async updateProductBySlugOrId(filter, payload) {
    const holderProduct = await getProductBySlugOrId({ filter });
    if (!holderProduct) {
      throw new NotFoundError("Product not found!");
    }
    const objectPayload = removeUndefinedObject(payload);

    const updateProduct = await updateProductBySlugOrId({
      filter,
      payload: updateNestedObjectParser(objectPayload),
      unSelect: ["__v"],
    });
    return updateProduct;
  }

  // PUT //
  static async draftProduct(filter) {
    return await togglePublishProduct(filter, false);
  }

  static async publishProduct(filter) {
    return await togglePublishProduct(filter, true);
  }
  // END PUT //

  // query
  static async findAllDraft({ limit = 50, skip = 0 }) {
    const query = { isPublished: false };
    return await findAllDraft({ query, limit, skip });
  }

  static async findAllPublish({ limit = 50, skip = 0 }) {
    const query = { isPublished: true };
    return await findAllPublish({ query, limit, skip });
  }

  static async getAllProductsAdmin({ limit = 50, skip = 0 }) {
    return await productModel
      .find()
      .populate("product_category", "category_name category_slug -_id")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec()
      .then((docs) => {
        docs.forEach((doc) => {
          doc.id = doc._id;
          delete doc._id;
        });
        return docs;
      });
  }

  static async searchProducts(keySearch) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    filter = { ...filter, isPublished: true };
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      // unSelect: ["_id"],
    });
  }

  static async findProductById(product_id) {
    return await getProductById({
      product_id,
      unSelect: ["__v"],
    });
  }

  static async findProductBySlugOrId(filter) {
    return await getProductBySlugOrId({
      filter,
      unSelect: ["__v"],
    });
  }

  static async findProductByCategoryId({
    category_id,
    limit = 12,
    sort = "top-new",
    page = 1,
    // filter = { isPublished: true },
    percent,
    star,
  }) {
    const filter = { product_category: category_id, isPublished: true };
    percent && (filter["product_price.percent"] = { $gte: Number(percent) });
    star && (filter["product_ratings.average"] = { $gte: Number(star) });

    console.log({ filter });
    return await getProductByCategoryId({
      limit,
      sort,
      page,
      filter,
      unSelect: ["__v"],
    });
  }
}

module.exports = ProductService;
