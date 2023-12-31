"use strict";

const { SuccessResponse, CREATED } = require("~/core/success.response");
const CategoryService = require("~/services/category.service");

class AccessController {
  createCategory = async (req, res, next) => {
    new CREATED({
      message: "Create Category Successfully",
      metadata: await CategoryService.createCategory(req.body),
    }).send(res);
  };

  findAllCategory = async (req, res, next) => {
    new SuccessResponse({
      message: "Find All Category Successfully.",
      metadata: await CategoryService.findAllCategory(req.body),
    }).send(res);
  };

  findCategory = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Category Successfully.",
      metadata: await CategoryService.findCategoryBySlugOrId(
        req.params.category_slug_or_id
      ),
    }).send(res);
  };

  updateCategoryById = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Category Successfully.",
      metadata: await CategoryService.updateCategoryById(
        req.params.category_id,
        req.body
      ),
    }).send(res);
  };

  deleteCategoryById = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Category Successfully.",
      metadata: await CategoryService.deleteCategoryById(
        req.params.category_id
      ),
    }).send(res);
  };

  toggleActiveCategoryById = async (req, res, next) => {
    new SuccessResponse({
      message: "Toggle Active Category Successfully.",
      metadata: await CategoryService.toggleActiveCategoryById(
        req.params.category_id
      ),
    }).send(res);
  };
}

module.exports = new AccessController();
