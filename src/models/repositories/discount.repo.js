"use strict";

const { getUnSelectData, getSelectData } = require("~/utils");
const { discount } = require("~/models/discount.model");

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const prodcuts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return prodcuts;
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const prodcuts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return prodcuts;
};

const checkDiscountExist = ({ filter }) => {
  return discount.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
};
