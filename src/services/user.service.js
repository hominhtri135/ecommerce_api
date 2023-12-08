"use strict";

const userModel = require("~/models/user.model");

const findByEmail = async ({ email, select = {} }) => {
  console.log("findByEmail::" + email);
  return await userModel.findOne({ email }).select(select);
};

module.exports = {
  findByEmail,
};
