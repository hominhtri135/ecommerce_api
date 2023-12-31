"use strict";

const { BadRequestError, NotFoundError } = require("~/core/error.response");
const { discount } = require("~/models/discount.model");
const productModel = require("~/models/product.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("~/models/repositories/discount.repo");
const { findAllProducts } = require("~/models/repositories/product.repo");
const { convertToObjectIdMongodb, validateRequiredFields } = require("~/utils");

class DiscountService {
  // start               here                      end
  // start               end                      here
  // here               start                      end
  static async createDiscountCode(payload) {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      max_uses_per_user,
      min_order_value,
      applies_to,
      product_ids,
      max_value,
    } = payload;

    validateRequiredFields({
      name,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      max_uses_per_user,
      min_order_value,
      applies_to,
    });

    if (type === "percentage") validateRequiredFields({ max_value });
    if (applies_to === "specific") validateRequiredFields({ product_ids });

    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount day invalid!");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date must be before End date!");
    }

    // create index for discount code
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: code,
      },
    });

    if (foundDiscount) {
      throw new BadRequestError("Discount code exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_uses_per_user: max_uses_per_user,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  // Get all discount codes of Shop
  static async getAllDiscountCodes({ limit, page }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_is_active: true,
      },
      unSelect: ["__v"],
    });

    return discounts;
  }

  static async updateDiscountCode() {
    //...
  }

  // Get all discount codes available with products
  static async getAllProductWithDiscountCode({ code, limit = 12, page = 1 }) {
    validateRequiredFields({ code });
    // create index for discount_code
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: code,
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products = [];
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
      });
    }

    return products;
  }

  // Apply discount code
  static async getDiscountAmount({ codeId, products }) {
    validateRequiredFields({ codeId, products });
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists!");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_uses_count,
      discount_value,
      discount_type,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount expried!");
    if (discount_uses_count >= discount_max_uses)
      throw new NotFoundError("Discount are out!");

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new BadRequestError("Discount expried!");
    // }

    //get total

    let totalOrder = products.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);

    // check co set gia tri toi thieu hay khong
    if (discount_min_order_value > 0) {
      if (totalOrder < discount_min_order_value)
        throw new NotFoundError(
          `Discount requires a minimum order value of ${discount_min_order_value}`
        );
    }

    // if (discount_max_uses_per_user > 0) {
    //   const userUsedDiscount = discount_users_used.find(
    //     (user) => user.userId === userId
    //   );

    //   if (userUsedDiscount) {
    //     //...
    //   }
    // }

    // check xem discount la fixed_amount or specific
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  // Delete discount code basic: delete from database
  // recommend delete code but save to history schema
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId,
    });

    return deleted;
  }

  // Cancel discount from User
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists!");
    }

    const result = discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
