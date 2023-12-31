"use strict";

const JWT = require("jsonwebtoken");
const {
  AuthFailureError,
  NotFoundError,
  BadRequestError,
} = require("~/core/error.response");
const asyncHandler = require("~/helpers/asyncHandler");

//service
const { findByUserId } = require("~/services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userId missing??
    2 - get AT
    3 - verifyToken
    4 - check user in dbs?
    5 - check keyStore with this userId?
    6 - OKall => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(
        refreshToken,
        keyStore.privateKey,
        (err, decoded) => {
          if (decoded) return decoded;
          if (err?.name === "TokenExpiredError")
            throw new AuthFailureError("Token expired");
          if (err?.name === "NotBeforeError")
            throw new AuthFailureError("Token not active");
        }
      );
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.replace("Bearer ", "");
  if (!accessToken) throw new AuthFailureError("Invalid Request accessToken");

  try {
    const decodeUser = JWT.verify(
      accessToken,
      keyStore.publicKey,
      (err, decoded) => {
        // console.log("JWT:::", { err, decoded });
        // console.log("err:::message", err?.message);
        // console.log("err:::name", err?.name);

        if (decoded) return decoded;
        if (err?.name === "TokenExpiredError")
          throw new AuthFailureError("Token expired");
        if (err?.name === "NotBeforeError")
          throw new AuthFailureError("Token not active");
      }
    );

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const manager = (req, res, next) => {
  if (req.user && (req.user.role === "MANAGER" || req.user.role === "ADMIN")) {
    next();
  } else {
    throw new AuthFailureError("Not authorized as an Manager");
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    throw new AuthFailureError("Not authorized as an Admin");
  }
};

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWT, manager, admin };
