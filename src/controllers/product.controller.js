"use strict";

const { SuccessResponse } = require("~/core/success.response");
const ProductFactory = require("~/services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Product Success",
      metadata: await ProductFactory.createProduct(req.body),
    }).send(res);
  };

  // update product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product Success",
      metadata: await ProductFactory.updateProductBySlugOrId(
        req.params.product_slug_or_id,
        req.body
      ),
    }).send(res);
  };

  draftProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Draft Product Success",
      metadata: await ProductFactory.draftProduct(
        req.params.product_slug_or_id
      ),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product Success",
      metadata: await ProductFactory.publishProduct(
        req.params.product_slug_or_id
      ),
    }).send(res);
  };

  // QUERY //
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDrafts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductFactory.findAllDraft(req.query),
    }).send(res);
  };

  getAllPublish = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success",
      metadata: await ProductFactory.findAllPublish(req.query),
    }).send(res);
  };

  getAllProductsAdmin = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list all admin success",
      metadata: await ProductFactory.getAllProductsAdmin(req.query),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Search success",
      metadata: await ProductFactory.searchProducts(req.params.keySearch),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Find All Products success",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Find Product success",
      metadata: await ProductFactory.findProductBySlugOrId(
        req.params.product_slug_or_id
      ),
    }).send(res);
  };

  findProductByCategoryId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Find Product Category success",
      metadata: await ProductFactory.findProductByCategoryId({
        ...req.query,
        category_id: req.params.category_id,
      }),
    }).send(res);
  };

  // END QUERY //
}

module.exports = new ProductController();
