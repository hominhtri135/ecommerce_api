"use strict";

const express = require("express");
const { authentication, admin } = require("~/middlewares/authUtils");
const productController = require("~/controllers/product.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

router.get("/", asyncHandler(productController.findAllProducts));
// router.get("/:product_id", asyncHandler(productController.findProduct));

router.get("/:product_slug_or_id", asyncHandler(productController.findProduct));

router.get(
  "/category/:category_id",
  asyncHandler(productController.findProductByCategoryId)
);

// authentication //
router.use(authentication);
router.use(admin);
////////////////////

router.post("/", asyncHandler(productController.createProduct));
router.patch(
  "/:product_slug_or_id",
  asyncHandler(productController.updateProduct)
);

router.post(
  "/:product_slug_or_id/draft",
  asyncHandler(productController.draftProduct)
);

router.post(
  "/:product_slug_or_id/publish",
  asyncHandler(productController.publishProduct)
);

// QUERY //
router.post("/draft", asyncHandler(productController.getAllDrafts));
router.post("/publish", asyncHandler(productController.getAllPublish));
router.post("/all", asyncHandler(productController.getAllProductsAdmin));

module.exports = router;
