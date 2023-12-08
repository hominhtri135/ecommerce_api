"use strict";

const userModel = require("~/models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("~/services/keyToken.service");
const { createTokenPair } = require("~/middlewares/authUtils");
const {
  getInfoData,
  validatePassword,
  validateRequiredFields,
} = require("~/utils");
const {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("~/core/error.response");
const { findByEmail } = require("~/services/user.service");

const RoleUser = {
  USER: "USER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
   Check this token used?
  */
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (!refreshToken) throw new AuthFailureError("Don't find refresh token");

    // neu nhu refreshtoken da co trong danh su da duoc su dung
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!!!  Please relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Refresh token don't match!");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Invalid token!");

    //create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //da duoc su dung de lay token moi
      },
    });

    return {
      // user: getInfoData({
      //   fields: ["userId", "email"],
      //   object: user,
      // }),
      user,
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
  static login = async ({ email, password, refreshToken = null }) => {
    // 1 - check email in dbs

    const foundUser = await findByEmail({ email });

    if (!foundUser) {
      throw new BadRequestError("User not registered");
    }

    // 2 - match password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }

    // 3 - create AT vs RT and save
    // created privateKey, publicKey
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    // 4 - generate tokens
    const { _id: userId } = foundUser;
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
      user: getInfoData({
        fields: [
          "_id",
          "name",
          "email",
          "phone",
          "avatar",
          "address",
          "role",
          "isVerify",
          "lock",
        ],
        object: foundUser,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists?

    const holderShop = await userModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
    });
    console.log("newUser", newUser);
    if (newUser) {
      // created privateKey, publicKey
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      // Public key CryptoGraphy Standards !
      console.log({ publicKey, privateKey });

      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success::`, tokens);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error");
      }

      return {
        user: getInfoData({
          fields: [
            "_id",
            "name",
            "email",
            "phone",
            "avatar",
            "address",
            "role",
            "isVerify",
            "lock",
          ],
          object: newUser,
        }),
        tokens,
      };
    }

    return {
      statusCode: 200,
      metadata: null,
    };
  };

  static updatePassword = async ({
    user,
    password_old,
    password_new,
    password_confirmation,
  }) => {
    // Kiểm tra từng trường bắt buộc
    validateRequiredFields({
      password_old,
      password_new,
      password_confirmation,
    });

    const { email } = user;

    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("User not registered");

    const match = await bcrypt.compare(password_old, foundUser.password);
    if (!match) throw new AuthFailureError("The old password is incorrect.");

    if (!validatePassword(password_new))
      throw new BadRequestError(
        "New password must have at least 6 characters."
      );

    if (password_new !== password_confirmation)
      throw new BadRequestError(
        "New passwords do not match. Please check again."
      );

    if (password_old === password_new)
      throw new BadRequestError(
        "New password cannot be the same as current password. Please enter a different password."
      );

    // kiem tra mat khau moi da duoc su dung truoc do hay chua
    const passwordsUsed = foundUser.passwordsUsed;
    for (let hash of passwordsUsed) {
      // So sanh password_new với moi hash
      if (await bcrypt.compare(password_new, hash))
        throw new BadRequestError(
          "New password has already been used before. Please enter a password that you have not used."
        );
    }

    //update password
    const passwordHash = await bcrypt.hash(password_new, 10);
    await foundUser.updateOne({
      $set: {
        password: passwordHash,
      },
      $addToSet: {
        passwordsUsed: foundUser.password, //them vao password da duoc su dung
      },
    });

    return true;
  };

  static resetPassword = async ({ user }) => {};
}

module.exports = AccessService;
