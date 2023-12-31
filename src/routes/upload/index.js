"use strict";

const express = require("express");
const { authentication } = require("~/middlewares/authUtils");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();
const upload = require("~/configs/config.multer.js");
const uploadController = require("~/controllers/upload.controller");

// authentication //
router.use(authentication);
////////////////////
router
  .route("/")
  .post(upload.array("images"), asyncHandler(uploadController.uploadImages));

module.exports = router;
