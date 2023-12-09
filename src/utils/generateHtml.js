"use strict";

const verifyEmailHtml = ({ name, email, emailToken }) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Verify Email From Lialili Studio
    <div>
       ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    </div>
  </div>
  <body
    style="
      background-color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        background-color: #fff7f7;
        border-radius: 4px;
        border: 1px solid #eaeaea;
        padding: 20px;
        width: 465px;
        margin: 40px auto;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-top: 32px"
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      alt="Lialili Studio logo"
                      src="https://cdn.discordapp.com/attachments/932210360520429579/1182725732850487316/Lialili-02_-_Copy.png"
                      style="
                        display: block;
                        outline: none;
                        border: none;
                        text-decoration: none;
                        margin: 0 auto;
                        width: 40%;
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <h1
              style="
                padding: 0;
                margin: 30px 0;
                font-weight: 400;
                text-align: center;
                color: #111;
                font-size: 24px;
              "
            >
              <strong>Thanks for signing up</strong>
            </h1>
            <p
              style="
                font-size: 14px;
                line-height: 1.5;
                margin: 16px 0;
                color: #000000;
              "
            >
              Hello <strong style="color: #e8a4a5">${name}</strong>,
            </p>
            <p
              style="
                font-size: 14px;
                line-height: 1.5;
                margin: 16px 0;
                color: #000000;
              "
            >
              You have entered
              <a
                href="mailto:${email}"
                style="color: #e8a4a5; text-decoration: none"
                target="_blank"
                >${email}</a
              >
              as your Email Address for your account.
            </p>
            <p
              style="
                font-size: 14px;
                line-height: 1.5;
                margin: 16px 0;
                color: #000000;
              "
            >
              To confirm your email, just click the button below:
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align: center; margin: 32px 0"
            >
              <tbody>
                <tr>
                  <td>
                    <a
                      href="${process.env.CLIENT_URL}/verify-email?email=${email}&emailToken=${emailToken}"
                      style="
                        color: #fff;
                        text-decoration: none;
                        background-color: #e8a4a5;
                        font-size: 14px;
                        border: 0;
                        border-radius: 6px;
                        padding: 14px 24px;
                        display: inline-block;
                        text-align: center;
                        font-weight: 500;
                      "
                      target="_blank"
                      >Confirm Your Email</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="
                font-size: 14px;
                line-height: 1.5;
                margin: 16px 0;
                color: #000000;
              "
            >
              or copy and paste this URL into your browser:<br /><a
                href="${process.env.CLIENT_URL}/verify-email?email=${email}&emailToken=${emailToken}"
                style="color: #e8a4a5; text-decoration: none"
                target="_blank"
                >${process.env.CLIENT_URL}/verify-email?email=${email}&emailToken=${emailToken}</a
              >
            </p>
            <hr
              style="
                width: 100%;
                border: none;
                border-top: 1px solid #eaeaea;
                border-color: #e5e5e5;
                margin: 0;
                margin-top: 26px;
              "
            />
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding-top: 22px"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="width: 166px; margin: auto"
                    >
                      <tbody style="width: 100%">
                        <tr style="width: 100%">
                          <td data-id="__react-email-column">
                            <a
                              href="#"
                              style="
                                color: #afafaf;
                                text-decoration: underline;
                                margin: 0;
                                font-size: 13px;
                                text-align: center;
                              "
                              target="_blank"
                              >Web Version</a
                            >
                          </td>
                          <td data-id="__react-email-column">
                            <a
                              href="#"
                              style="
                                color: #afafaf;
                                text-decoration: underline;
                                margin: 0;
                                font-size: 13px;
                                text-align: center;
                              "
                              target="_blank"
                              >Privacy Policy</a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style="
                        font-size: 13px;
                        line-height: 24px;
                        margin: 0;
                        color: #afafaf;
                        text-align: center;
                        padding-top: 10px;
                      "
                    >
                      Please contact us if you have any questions.
                    </p>
                    <p
                      style="
                        font-size: 13px;
                        line-height: 24px;
                        margin: 0;
                        color: #afafaf;
                        text-align: center;
                      "
                    >
                      © 2023 Lialili Studio. All Rights Reserved.
                    </p>
                    <p
                      style="
                        font-size: 13px;
                        line-height: 24px;
                        margin: 0;
                        color: #afafaf;
                        text-align: center;
                      "
                    >
                      Lialili Studio, Ho Chi Minh City, Vietnam.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
  `;
};

module.exports = {
  verifyEmailHtml,
};
