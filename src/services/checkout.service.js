"use strict";

const { BadRequestError } = require("~/core/error.response");
const { findCartById } = require("~/models/repositories/cart.repo");
const { checkProductByServer } = require("~/models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("~/models/order.model");
const { refundInventory } = require("~/models/repositories/inventory.repo");
const { deleteCartByUserId } = require("./cart.service");
const { validatePassword, validateRequiredFields } = require("~/utils");

class CheckoutService {
  // login and without login
  /*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId, 
                shop_discounts: [
                    {
                        shopId, 
                        discountId,
                        codeId,
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
    */
  static async checkoutReview({ cartId, discountCode }) {
    // check cartId exists?
    const foundCart = await findCartById({ cartId });
    if (!foundCart) throw new BadRequestError("Cart does not exist");

    const checkout_order = {
      totalOrder: 0, // tong tien hang
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0, // tong tien thanh toan
    };

    const checkProductServer = await checkProductByServer(
      foundCart.cart_products
    );
    console.log(`checkProductServer::`, checkProductServer);
    if (!checkProductServer[0]) throw new BadRequestError("order wrong!!");

    // tong tien don hang
    const checkoutPrice = checkProductServer.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);
    checkout_order.totalOrder = checkoutPrice;

    if (discountCode) {
      const { discount } = await getDiscountAmount({
        codeId: discountCode,
        products: checkProductServer,
      });
      checkout_order.totalDiscount = discount;
    }

    checkout_order.totalCheckout =
      checkout_order.totalOrder - checkout_order.totalDiscount;

    return {
      cart: foundCart,
      checkout_order,
    };
  }

  // order
  static async orderByUser({
    cartId,
    userId,
    discountCode,
    user_address,
    user_payment,
  }) {
    validateRequiredFields({ cartId, user_address, user_payment });

    const { cart, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      discountCode,
    });

    // check lai mot lan nua xem vuot ton kho hay khong?
    // get new array Products
    const products = cart.cart_products;
    console.log(`[1]::`, products);

    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, select } = products[i];
      const keyLock = await acquireLock(productId, select);
      console.log({ keyLock });
      /*
      xử lý acquireLock
      xử lý trừ số lượng sản phẩm reservationInventory
      chỉnh sửa lại cho phù hợp với model order: ispayment, payment, address
      */
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }
    console.log({ acquireProduct });

    // check if co  mot san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      acquireProduct.forEach(async (value, key) => {
        if (value === true) {
          const { productId, select } = products[key];
          const quantityUpdate = await refundInventory({ productId, select });
        }
      });

      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat, vui long quay lai gio hang"
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: cart.cart_products,
    });

    // truong hop: neu insert thanh cong thi remove product co trong cart
    if (newOrder) {
      await deleteCartByUserId(userId);
    }

    return newOrder;
  }

  // query order [user]
  static async getOrderByUser() {}

  // query order using id [user]
  static async getOneOrderByUser() {}

  // cancel order [user]
  static async cancelOrderByUser() {}

  // update order status [shop | admin]
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
