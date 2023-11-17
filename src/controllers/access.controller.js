"use strict";

const { SuccessResponse, CREATED } = require("~/core/success.response");
const AccessService = require("~/services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handlerRefreshToken({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Regiserted OK!",
      metadata: await AccessService.signUp(req.body),
      //send options
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
