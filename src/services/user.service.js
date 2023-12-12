"use strict";

const userModel = require("~/models/user.model");

const findByEmail = async ({ email, select = {} }) => {
  console.log("findByEmail::" + email);
  return await userModel.findOne({ email }).select(select);
};

const findByEmailorUsername = async ({ username, select = {} }) => {
  return await userModel
    .findOne({
      $or: [{ email: username }, { username }],
    })
    .select(select)
    .lean();
};

module.exports = {
  findByEmail,
  findByEmailorUsername,
};
