"use strict";

const shopModel = require("~/models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("~/services/keyToken.service");
const { createTokenPair, verifyJWT } = require("~/auth/authUtils");
const { getInfoData } = require("~/utils");
const {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("~/core/error.response");
const { findByEmail } = require("~/services/shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
   Check this token used?
  */
  static handlerRefreshToken = async (refreshToken) => {
    console.log("handlerRefreshToken: " + refreshToken);
    // check xem token da duoc su dung hay chua
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // decode xem user nao
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!!!  Please relogin");
    }

    // token chua duoc su dung
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered 1");
    console.log(
      "handlerRefreshToken holderToken::" + JSON.stringify(holderToken)
    );
    //verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]::", { userId, email });
    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered 2");

    //create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //da duoc su dung de lay token moi
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  /*
    1 - check email in dbs
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null, ...props }) => {
    // 1 - check email in dbs

    const foundShop = await findByEmail({ email });
    console.log({ email, props });

    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }

    // 2 - match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }

    // 3 - create AT vs RT and save
    // created privateKey, publicKey
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    // 4 - generate tokens
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5 - get data return login
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists?

    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      // Public key CryptoGraphy Standards !
      console.log({ publicKey, privateKey }); // save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error");
      }

      // created token pair (AT and RT)
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
