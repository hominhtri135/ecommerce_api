"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const { BadRequestError } = require("~/core/error.response");

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id);
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// ['a', 'b'] => {a: 1, b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] => {a: 0, b:0}
const getUnSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object")
      removeUndefinedObject(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });
  return obj;
};

/*
const a = {
  c: {
    d: 1,
    e: 2
  }
}

db.collection.updateOne({
  'c.d': 1,
  'c.e': 2
})
*/
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const validatePassword = (password) => {
  // var regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}:"<>?<>]).*$/; // it nhat 8 ki tu, 1 in hoa, 1 ki tu dac biet
  var regex = /^.*(?=.{6,}).*$/; // it nhat 6 ki tu
  if (!regex.test(password)) {
    return false;
  }
  // if (password.length < 6) {
  //   return false;
  // }

  return true;
};

const validateRequiredFields = (data) => {
  const keys = [];
  for (let key in data) {
    if (data[key] === null || data[key] === undefined) {
      keys.push(key);
    }
  }

  const missingFields = keys.join(", ");
  if (missingFields) {
    throw new BadRequestError(`Missing required fields: ${missingFields}`);
  }

  return true;
};

module.exports = {
  convertToObjectIdMongodb,
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  validatePassword,
  validateRequiredFields,
};
