"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const { BadRequestError } = require("~/core/error.response");

const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const convertToObjectIdMongodb = (id) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const ObjectId = new Types.ObjectId(id);
  return ObjectId;
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
    if (obj[key] === null || obj[key] === undefined || obj[key] === "")
      delete obj[key];
    // remove array empty
    if (Array.isArray(obj[key]) && obj[key].length === 0) delete obj[key];
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

// nested array and object parser
// const updateNestedObjectParser = (obj) => {
//   const final = {};

//   const processObject = (data, parentKey = "") => {
//     Object.keys(data).forEach((key) => {
//       const currentKey = parentKey ? `${parentKey}.${key}` : key;

//       if (Array.isArray(data[key])) {
//         data[key].forEach((item) => {
//           if (key !== "_id") {
//             const itemId = item._id;
//             processObject(item, `${currentKey}.${itemId}`);
//           }
//         });
//       } else if (typeof data[key] === "object" && !Array.isArray(data[key])) {
//         processObject(data[key], currentKey);
//       } else {
//         if (key !== "_id") {
//           final[currentKey] = data[key];
//         }
//       }
//     });
//   };

//   processObject(obj);

//   return final;
// };

const validatePassword = (password) => {
  // var regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}:"<>?<>]).*$/; // it nhat 8 ki tu, 1 in hoa, 1 ki tu dac biet
  const regex = /^.*(?=.{6,}).*$/; // it nhat 6 ki tu

  if (!password) return false;

  if (!regex.test(password)) {
    return false;
  }
  // if (password.length < 6) {
  //   return false;
  // }

  return true;
};

const validateEmail = (email) => {
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email) return false;

  if (email.length > 254) return false;

  const valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

const validateRequiredFields = (data) => {
  const keys = [];
  for (let key in data) {
    if (data[key] === null || data[key] === undefined || data[key] === "") {
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
  isValidObjectId,
  convertToObjectIdMongodb,
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  validatePassword,
  validateEmail,
  validateRequiredFields,
};
