"use strict";

const { SuccessResponse } = require("~/core/success.response");
const UploadService = require("~/services/upload.service");
const {
  app: { port },
} = require("~/configs/config.mongodb");

const PORT = port;

class UploadController {
  uploadImages = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload Image Success",
      metadata: await UploadService.uploadImages({
        file: req.file,
        files: req.files,
        body: req.body,
        error: req.fileValidationError,
        url: `${req.protocol}://${req.hostname}:${PORT}/uploads/`,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
