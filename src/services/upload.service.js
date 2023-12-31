"use strict";

const { BadRequestError } = require("~/core/error.response");
const multer = require("~/configs/config.multer");

class UploadService {
  static uploadImages = async ({ file, files, body, url }) => {
    console.log({ file, files, body, url });
    if (!files || files.length === 0)
      throw new BadRequestError("Do not find file.");
    if (files.length > 0) {
      const result = files.map((file) => {
        return url + file.filename;
      });
      return result;
    }
    return null;
  };
}

module.exports = UploadService;
