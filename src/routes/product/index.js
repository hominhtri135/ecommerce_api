"use strict";

const express = require("express");
const { authentication } = require("~/auth/authUtils");
const productController = require("~/controllers/product.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
// authentication //
router.use(authentication);
////////////////////
router.post("/", asyncHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

// QUERY //
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
