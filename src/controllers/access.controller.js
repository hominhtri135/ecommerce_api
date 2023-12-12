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
      message: "Login success!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  loginSocialMedia = async (req, res, next) => {
    new SuccessResponse({
      message: "Login Social Media success!",
      metadata: await AccessService.loginSocialMedia(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Regiserted OK!",
      metadata: await AccessService.signUp(req.body),
      //send options
      // options: {
      //   limit: 10,
      // },
    }).send(res);
  };

  signUpSocialMedia = async (req, res, next) => {
    new CREATED({
      message: "Regiserted Social Media OK!",
      metadata: await AccessService.signUpSocialMedia(req.body),
    }).send(res);
  };

  updatePassword = async (req, res, next) => {
    new SuccessResponse({
      message: "Password changed successfully.",
      metadata: await AccessService.updatePassword({
        user: req.user,
        ...req.body,
      }),
    }).send(res);
  };

  verifyEmail = async (req, res, next) => {
    new SuccessResponse({
      message: "Verify Email Successfully.",
      metadata: await AccessService.verifyEmail(req.body),
    }).send(res);
  };

  sendMailVerifyEmail = async (req, res, next) => {
    new SuccessResponse({
      message: "Send Mail Verify Successfully.",
      metadata: await AccessService.sendMailVerifyEmail(req.user),
    }).send(res);
  };
}

module.exports = new AccessController();
