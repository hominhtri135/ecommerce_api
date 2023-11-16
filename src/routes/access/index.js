"use strict";

const express = require("express");
const accessController = require("~/controllers/access.controller");
const asyncHandler = require("~/helpers/asyncHandler");
const router = express.Router();

// signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));

// login
router.post("/shop/login", asyncHandler(accessController.login));

// authentication //

////////////////////

module.exports = router;
