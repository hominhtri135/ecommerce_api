"use strict";

const productModel = require("~/models/product.model");
const {
  getSelectData,
  getUnSelectData,
  convertToObjectIdMongodb,
} = require("~/utils");

const findAllDraft = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublish = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const getAllProductsAdmin = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(12)
    .lean();

  return results;
};

const togglePublishProduct = async (filter, state) => {
  const foundProduct = await productModel.findOne({
    $or: [{ _id: convertToObjectIdMongodb(filter) }, { product_slug: filter }],
  });
  if (!foundProduct) return null;

  foundProduct.isPublished = state;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const findAllProducts = async ({
  limit,
  sort,
  page,
  filter,
  unSelect = [],
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const prodcuts = await productModel
    .find(filter)
    .populate("product_category", "category_name category_slug -_id")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    // .select(getUnSelectData(unSelect))
    .lean()
    .exec()
    .then((docs) => {
      if (docs) {
        docs = docs.map((doc) => {
          // Loại bỏ các trường _id ngoại trừ _id product
          doc.product_images = doc.product_images.map((img) => {
            // delete img._id;
            // delete img.size;
            return img.url;
          });

          doc.product_variations = doc.product_variations.map((variation) => {
            delete variation._id;
            variation.sizes = variation.sizes.map((size) => {
              delete size._id;
              return size;
            });
            return variation;
          });

          // Tạo biến variations từ mảng product_variations, Set để loại bỏ giá trị trùng lặp
          const variationsSet = new Set(
            doc.product_variations.map((variation) => variation.name)
          );
          const variations = Array.from(variationsSet);

          // Tạo biến sizes từ mảng product_variations
          const sizesSet = new Set(
            doc.product_variations.flatMap((variation) =>
              variation.sizes.map((size) => size.name)
            )
          );
          const sizes = Array.from(sizesSet);

          doc.variations = variations;
          doc.sizes = sizes;

          delete doc.__v;

          return doc;
        });
        // Thay đổi _id thành id
        // doc.id = doc._id;
        // delete doc._id;
      }

      return docs;
    });

  return prodcuts;
};

const getProductByCategoryId = async ({
  limit,
  sort,
  page,
  filter,
  unSelect = [],
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sortProducts(sort);
  const count = await productModel.find(filter).countDocuments().lean();

  const products = await productModel
    .find(filter)
    .populate("product_category", "category_name category_slug -_id")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean()
    .exec()
    .then((docs) => {
      if (docs) {
        docs = docs.map((doc) => {
          // Loại bỏ các trường _id ngoại trừ _id product
          doc.product_images = doc.product_images.map((img) => {
            // delete img._id;
            // delete img.size;
            return img.url;
          });

          doc.product_variations = doc.product_variations.map((variation) => {
            delete variation._id;
            variation.sizes = variation.sizes.map((size) => {
              delete size._id;
              return size;
            });
            return variation;
          });

          // Tạo biến variations từ mảng product_variations, Set để loại bỏ giá trị trùng lặp
          const variationsSet = new Set(
            doc.product_variations.map((variation) => variation.name)
          );
          const variations = Array.from(variationsSet);

          // Tạo biến sizes từ mảng product_variations
          const sizesSet = new Set(
            doc.product_variations.flatMap((variation) =>
              variation.sizes.map((size) => size.name)
            )
          );
          const sizes = Array.from(sizesSet);

          doc.variations = variations;
          doc.sizes = sizes;

          delete doc.__v;

          return doc;
        });
        // Thay đổi _id thành id
        // doc.id = doc._id;
        // delete doc._id;
      }

      return docs;
    });

  const pageCount = Math.ceil(count / limit);
  return { products, pageCount, page, limit, totalProducts: count };
};

const getProductById = async ({ product_id, unSelect = [] }) => {
  return await productModel
    .findById(product_id)
    .select(getUnSelectData(unSelect))
    .lean();
};

const getProductBySlugOrId = async ({ filter, unSelect = [] }) => {
  const product = await productModel
    .findOne({
      $or: [
        { _id: convertToObjectIdMongodb(filter) },
        { product_slug: filter },
      ],
    })
    .populate("product_category", "category_name category_slug -_id")
    .select(getUnSelectData(unSelect))
    .lean()
    .exec()
    .then((doc) => {
      if (doc) {
        // Loại bỏ các trường _id ngoại trừ _id product
        doc.product_images = doc.product_images.map((img) => {
          // delete img._id;
          // delete img.size;
          return img.url;
        });

        doc.product_variations = doc.product_variations.map((variation) => {
          delete variation._id;
          variation.sizes = variation.sizes.map((size) => {
            delete size._id;
            return size;
          });
          return variation;
        });

        // Tạo biến variations từ mảng product_variations, Set để loại bỏ giá trị trùng lặp
        const variationsSet = new Set(
          doc.product_variations.map((variation) => variation.name)
        );
        const variations = Array.from(variationsSet);

        // Tạo biến sizes từ mảng product_variations
        const sizesSet = new Set(
          doc.product_variations.flatMap((variation) =>
            variation.sizes.map((size) => size.name)
          )
        );
        const sizes = Array.from(sizesSet);

        doc.variations = variations;
        doc.sizes = sizes;

        // Thay đổi _id thành id
        // doc.id = doc._id;
        // delete doc._id;
      }

      return doc;
    });

  return product;
};

const updateProductById = async ({
  product_id,
  payload,
  unSelect = [],
  isNew = true,
}) => {
  return await productModel
    .findByIdAndUpdate(product_id, payload, {
      new: isNew,
    })
    .select(getUnSelectData(unSelect));
};

const updateProductBySlugOrId = async ({
  filter,
  payload,
  unSelect = [],
  isNew = true,
}) => {
  return await productModel
    .findOneAndUpdate(
      {
        $or: [
          { _id: convertToObjectIdMongodb(filter) },
          { product_slug: filter },
        ],
      },
      payload,
      {
        new: isNew,
      }
    )
    .select(getUnSelectData(unSelect));
};

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_category", "-_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById({
        product_id: product.productId,
      });

      if (foundProduct) {
        return {
          price: foundProduct.product_price.final,
          quantity: product.select.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

const filterProducts = ({ textSearch, product_category, star, percent }) => {
  const filters = [];
  // .find(
  //   {
  //     isPublished: true,
  //     $text: { $search: regexSearch },
  //   },
  //   { score: { $meta: "textScore" } }
  // )
  // .sort({ score: { $meta: "textScore" } })

  if (textSearch) {
    filters.push({
      $search: {
        index: "search_product",
        text: {
          query: textSearch.toString(),
          path: {
            wildcard: "*",
          },
          fuzzy: {},
        },
      },
    });
  }
  if (product_category) {
    filters.push({
      $match: {
        product_category: new mongoose.Types.ObjectId(product_category),
      },
    });
  }
  if (percent) {
    filters.push({
      $match: { "product_price.percent": { $gte: Number(percent) } },
    });
  }
  if (star) {
    filters.push({
      $match: { "product_ratings.average": { $gte: Number(star) } },
    });
  }

  return filters;
};
const sortProducts = (sortBy) => {
  switch (sortBy) {
    case "top-new":
      return { _id: -1 };
    // case 'top-sold':
    //     return { sold: -1 } };
    case "top-views":
      return { product_views: -1 };
    case "price-asc":
      return { "product_price.final": 1 };
    case "price-desc":
      return { "product_price.final": -1 };
    default:
      return { _id: 1 };
  }
};

module.exports = {
  getAllProductsAdmin,
  findAllDraft,
  findAllPublish,
  togglePublishProduct,
  searchProductByUser,
  findAllProducts,
  getProductById,
  updateProductById,
  checkProductByServer,
  getProductBySlugOrId,
  updateProductBySlugOrId,
  getProductByCategoryId,
};
