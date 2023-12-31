"use strict";

const express = require("express");
const { authentication, admin } = require("~/middlewares/authUtils");
const productController = require("~/controllers/product.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const categoryController = require("~/controllers/category.controller");
const router = express.Router();

router.get(
  "/:category_slug",
  asyncHandler(categoryController.findCategoryBySlug)
);

router.post("/:category_id", asyncHandler(categoryController.findCategoryById));

router.get("/", asyncHandler(categoryController.findAllCategory));

// authentication //
router.use(authentication);
router.use(admin);
////////////////////

router.post("/", asyncHandler(categoryController.createCategory));
router.patch(
  "/:category_id",
  asyncHandler(categoryController.updateCategoryById)
);
router.delete(
  "/:category_id",
  asyncHandler(categoryController.deleteCategoryById)
);

module.exports = router;
