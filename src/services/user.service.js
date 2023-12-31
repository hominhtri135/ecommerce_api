"use strict";

const userModel = require("~/models/user.model");

const findByEmail = async ({ email, select = {} }) => {
  return await userModel.findOne({ email }).select(select);
};

const findByUsername = async ({ username, select = {} }) => {
  return await userModel
    .findOne({
      $or: [{ email: username }, { phone: username }],
    })
    .select(select)
    .lean();
};

module.exports = {
  findByEmail,
  findByUsername,
};
