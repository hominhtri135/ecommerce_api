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

// login with social account

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

module.exports = router;
