"use strict";

const express = require("express");
const { authentication } = require("~/middlewares/authUtils");
const accessController = require("~/controllers/access.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

// signUp
router.post("/auth/signup", asyncHandler(accessController.signUp));

// login
router.post("/auth/login", asyncHandler(accessController.login));

// login google account
router.post(
  "/auth/google/login",
  asyncHandler(accessController.loginWithGoogle)
);

// verify Email
router.post("/auth/verify-email", asyncHandler(accessController.verifyEmail));

// authentication //
router.use(authentication);
////////////////////
router.post("/auth/logout", asyncHandler(accessController.logout));
router.post(
  "/auth/refresh-token",
  asyncHandler(accessController.handlerRefreshToken)
);
router.patch(
  "/auth/update-password",
  asyncHandler(accessController.updatePassword)
);

// send mail verify Email
router.post(
  "/auth/send-mail-verify",
  asyncHandler(accessController.sendMailVerifyEmail)
);

module.exports = router;
