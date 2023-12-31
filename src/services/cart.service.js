"use strict";

const { NotFoundError } = require("~/core/error.response");
const { cart } = require("~/models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("~/models/repositories/cart.repo");
const { getProductById } = require("~/models/repositories/product.repo");
const { validateRequiredFields, convertToObjectIdMongodb } = require("~/utils");

class CartService {
  static async addToCart({ userId, product }) {
    validateRequiredFields({ product });
    // check product
    const foundProduct = await getProductById({
      product_id: product.productId,
    });
    if (!foundProduct) throw new NotFoundError("Product not exist");

    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      //create cart for user
      return await createUserCart({ userId, product });
    }

    // ton tai gio hang nhung khong co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // ton tai gio hang, co san pham => update quantity
    return updateUserCartQuantity({ userId, product });
  }

  // update in cart
  /*
    shop_order_ids: [
        {
            shopId,
            item_products: [
                {
                    productId
                    quantity,
                    old_quantity,
                    price,
                    shopId,
                }
            ]
            version
        }
    ]
  */
  static async updateCart({ userId, product }) {
    validateRequiredFields({ product });
    // check product
    const foundProduct = await getProductById({
      product_id: product.productId,
    });
    if (!foundProduct) throw new NotFoundError("Product not exist");

    if (product.select.quantity === 0) {
      return this.deleteItemUserCart({ userId, product });
    }

    return updateUserCartQuantity({ userId, product });
  }

  static async deleteItemUserCart({ userId, product }) {
    validateRequiredFields({ product });
    const { productId, select } = product;
    const query = {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.productId": productId,
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const { matchedCount } = await cart.updateOne(query, updateSet);
    return matchedCount;
  }

  static async deleteCartByUserId(userId) {
    return await cart.deleteOne({
      cart_userId: convertToObjectIdMongodb(userId),
    });
  }

  static async getListUserCart({ userId }) {
    validateRequiredFields({ userId });
    return await cart.findOne({
      cart_userId: convertToObjectIdMongodb(userId),
    });
  }
}

module.exports = CartService;
