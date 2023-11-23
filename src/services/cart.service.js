"use strict";

const { NotFoundError } = require("~/core/error.response");
const { cart } = require("~/models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("~/models/repositories/cart.repo");
const { getProductById } = require("~/models/repositories/product.repo");

class CartService {
  static async addToCart({ userId, product = {} }) {
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
  static async addToCart2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    console.log(JSON.stringify(shop_order_ids), {
      productId,
      quantity,
      old_quantity,
    });
    // check product
    const foundProduct = await getProductById({ product_id: productId });
    if (!foundProduct) throw new NotFoundError("Product not exist");
    // compare product shop
    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }
    if (quantity === 0) {
      // delete product
    }
    return await updateUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId });
  }
}

module.exports = CartService;
