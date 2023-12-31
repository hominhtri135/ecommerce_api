"use strict";
const { BadRequestError, NotFoundError } = require("~/core/error.response");
const categoryModel = require("~/models/catetory.model");
const {
  getUnSelectData,
  validateRequiredFields,
  removeUndefinedObject,
  updateNestedObjectParser,
  getInfoData,
  convertToObjectIdMongodb,
} = require("~/utils");

class CategoryService {
  static createCategory = async ({
    category_name,
    category_description,
    category_images,
  }) => {
    validateRequiredFields({ category_name });

    const holderCategory = await categoryModel
      .findOne({ category_name })
      .lean();
    if (holderCategory) {
      throw new BadRequestError("Category already exists!");
    }

    const newCategory = await categoryModel.create({
      category_name,
      category_description,
      category_images,
    });
    console.log("newCategory", newCategory);
    return getInfoData({
      fields: [
        "_id",
        "category_name",
        "category_description",
        "category_slug",
        "category_images",
        "category_products_number",
        "active",
        "createdAt",
        "updatedAt",
      ],
      object: newCategory,
    });
  };

  static findAllCategory = async () => {
    const Category = await categoryModel
      //   .find({ active: true })
      .find()
      // .select(getUnSelectData(["__v", "_id"]))
      .lean()
      .exec()
      .then((docs) => {
        // change _id to id
        // docs.forEach((doc) => {
        //   doc.id = doc._id;
        //   delete doc._id;
        // });
        return docs;
      });

    return Category;
  };

  static findCategoryBySlugOrId = async (filter) => {
    const holderCategory = await categoryModel
      .findOne({
        $or: [
          { _id: convertToObjectIdMongodb(filter) },
          { category_slug: filter },
        ],
      })
      .select(getUnSelectData(["__v"]))
      .lean();

    if (!holderCategory) {
      throw new NotFoundError("Category not found!");
    }
    return holderCategory;
  };

  static updateCategoryById = async (category_id, payload) => {
    const holderCategory = await categoryModel.findById(category_id).lean();
    if (!holderCategory) {
      throw new NotFoundError("Category not found!");
    }
    const objectPayload = removeUndefinedObject(payload);

    // console.log("object:::", updateNestedObjectParser(objectParams));

    // if (objectParams.images) {
    //   // update child
    //   // await updateProductById({
    //   //   product_id,
    //   //   payload: updateNestedObjectParser(objectParams.images),
    //   //   model: clothing,
    //   // });

    //   await categoryModel
    //     .findByIdAndUpdate(
    //       category_id,
    //       updateNestedObjectParser(objectParams.images),
    //       {
    //         new: true,
    //       }
    //     )
    //     .select(getUnSelectData(["__v"]));
    // }

    const updateCategory = await categoryModel
      .findByIdAndUpdate(category_id, updateNestedObjectParser(objectPayload), {
        new: true,
      })
      .select(getUnSelectData(["__v"]));
    return updateCategory;
  };

  static deleteCategoryById = async (category_id) => {
    const holderCategory = await categoryModel.findById(category_id).lean();
    if (!holderCategory) {
      throw new NotFoundError("Category not found!");
    }
    const delCategory = await categoryModel.deleteOne(
      convertToObjectIdMongodb(category_id)
    );
    return delCategory;
  };

  static toggleActiveCategoryById = async (category_id) => {
    const holderCategory = await categoryModel.findById(category_id).lean();
    if (!holderCategory) {
      throw new NotFoundError("Category not found!");
    }

    const updateCategory = await categoryModel.findByIdAndUpdate(category_id, {
      active: !holderCategory.active,
    });

    return {
      _id: updateCategory._id,
      category_name: updateCategory.category_name,
      active: updateCategory.active,
    };
  };
}

module.exports = CategoryService;
