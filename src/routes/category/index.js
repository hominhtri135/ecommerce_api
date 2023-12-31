"use strict";

const express = require("express");
const { authentication, admin } = require("~/middlewares/authUtils");
const productController = require("~/controllers/product.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const categoryController = require("~/controllers/category.controller");
const router = express.Router();

router.get("/", asyncHandler(categoryController.findAllCategory));

router.get(
  "/:category_slug_or_id",
  asyncHandler(categoryController.findCategory)
);

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

router.post(
  "/:category_id/toggle",
  asyncHandler(categoryController.toggleActiveCategoryById)
);

module.exports = router;
