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
  validateEmail,
} = require("~/utils");
const {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("~/core/error.response");
const { findByEmail } = require("~/services/user.service");
const { sendMailVerifyEmail } = require("~/helpers/mailer");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const BCRYPT_HASH = Number(process.env.BCRYPT_HASH);

class AccessService {
  /*
   Check this token used?
  */
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email, role } = user;
    if (!refreshToken) throw new AuthFailureError("Don't find refresh token");

    // neu nhu refreshtoken da co trong danh su da duoc su dung
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!!!  Please relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Refresh token don't match!");

    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new AuthFailureError("Invalid token!");

    //create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email, role },
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
    console.log("keyStore:::", keyStore);
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
    validateRequiredFields({ email, password });
    if (!validateEmail(email)) throw new BadRequestError("Email is not valid.");
    // 1 - check email in dbs

    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("User not registered.");
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
    const { _id: userId, role } = foundUser;
    const tokens = await createTokenPair(
      { userId, email, role },
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

  static loginWithGoogle = async (idToken) => {
    console.log("loginSocialMedia:::", { idToken });
    validateRequiredFields({ idToken });

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
    });
    const payload = ticket.getPayload();

    // Check if the user already exists
    let User = await findByEmail({ email: payload.email });

    if (!User) {
      User = await userModel.create({
        name: payload.name,
        email: payload.email,
        password: payload.sub,
        avatar: {
          url: payload.picture,
        },
        isVerify: payload.email_verified,
      });
    }

    // 3 - create AT vs RT and save
    // created privateKey, publicKey
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    // 4 - generate tokens
    const { _id: userId, email, role } = User;
    const tokens = await createTokenPair(
      { userId, email, role },
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
        object: User,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    validateRequiredFields({ name, email, password });

    if (!validateEmail(email)) throw new BadRequestError("Email is not valid.");

    if (!validatePassword(password))
      throw new BadRequestError("Password must have at least 6 characters.");
    // step 1: check email exists?

    const holderUser = await userModel.findOne({ email }).lean();
    if (holderUser) {
      throw new BadRequestError("Error: User already registered!");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_HASH);
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

      const { _id: userId, role } = newUser;
      const tokens = await createTokenPair(
        { userId, email, role },
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

      await sendMailVerifyEmail({
        name: newUser.name,
        email: newUser.email,
      });

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
    const passwordHash = await bcrypt.hash(password_new, BCRYPT_HASH);
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

  static verifyEmail = async ({ email, emailToken }) => {
    // Kiểm tra từng trường bắt buộc
    validateRequiredFields({ email, emailToken });

    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("User not registered");

    const match = await bcrypt.compare(email, emailToken);
    if (!match) throw new AuthFailureError("Invalid email.");

    foundUser.isVerify = true;
    await foundUser.save();
    return { ok: true, message: "Verify Email Successfully." };
  };

  static sendMailVerifyEmail = async ({ name, email }) => {
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("User not registered");

    if (foundUser.isVerify) throw new BadRequestError("Email already verified");
    sendMailVerifyEmail({ name, email });
    return { ok: true, message: "Send Mail Verify Successfully." };
  };
}

module.exports = AccessService;
