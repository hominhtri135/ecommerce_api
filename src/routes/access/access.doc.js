const signUp = {
  tags: ["Access"],
  summary: "Sign up",
  description: "Sign up",
  operationId: "signUp",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name",
              example: "Shop TIPS",
            },
            email: {
              type: "string",
              description: "Email",
              example: "shoptipjs4@gmail.com",
            },
            password: {
              type: "string",
              description: "Password",
              example: "abc123",
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              message: "Regiserted OK!",
              status: 201,
              metadata: {
                code: 201,
                metadata: {
                  shop: {
                    _id: "65579babe91d34becca84609",
                    name: "Shop TIPS",
                    email: "shoptipjs5@gmail.com",
                  },
                  tokens: {
                    accessToken: "eyJh...VCJ9.eyJ1...MjF9.PiaF...9dac",
                    refreshToken: "eyJh...VCJ9.eyJ1...MjF9.u2Ql...ftVY",
                  },
                },
              },
            },
          },
        },
      },
    },
    403: {
      $ref: "#/components/responses/UnauthorizedError",
    },
  },
  security: [{ api_key: [] }],
};

const login = {
  tags: ["Access"],
  summary: "Login",
  description: "Login",
  operationId: "login",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "Email",
              example: "shoptipjs4@gmail.com",
            },
            password: {
              type: "string",
              description: "Password",
              example: "abc123",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              message: "Success",
              status: 200,
              metadata: {
                shop: {
                  _id: "6557ae137257317b8de3b075",
                  name: "Shop TIPS",
                  email: "shoptipjs4@gmail.com",
                },
                tokens: {
                  accessToken: "eyJh...VCJ9.eyJ1...MjF9.PiaF...9dac",
                  refreshToken: "eyJh...VCJ9.eyJ1...MjF9.u2Ql...ftVY",
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "Authentication error",
    },
    403: {
      $ref: "#/components/responses/UnauthorizedError",
    },
  },
  security: [{ api_key: [] }],
};

const logout = {
  tags: ["Access"],
  summary: "Logout",
  description: "Logout",
  operationId: "logout",
  parameters: [
    {
      name: "x-client-id",
      in: "header",
      description: "User ID",
      required: true,
      type: "string",
      example: "6557ae137257317b8de3b075",
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              message: "Logout success!",
            },
          },
        },
      },
    },
    403: {
      $ref: "#/components/responses/UnauthorizedError",
    },
  },
  security: [{ bearerAuth: [] }, { api_key: [] }],
};

const refreshToken = {
  tags: ["Access"],
  summary: "refreshToken",
  description: "refreshToken",
  operationId: "refreshToken",
  parameters: [
    {
      name: "x-client-id",
      in: "header",
      description: "User ID",
      required: true,
      type: "string",
      example: "6557ae137257317b8de3b075",
    },
    {
      name: "x-rtoken-id",
      in: "header",
      description: "Refresh Token",
      required: true,
      type: "string",
      example: "eyJh...VCJ9.eyJ1...MjF9.u2Ql...ftVY",
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              message: "Get token success!",
              status: 200,
              metadata: {
                user: {
                  userId: "6557ae137257317b8de3b075",
                  email: "shoptipjs4@gmail.com",
                },
                tokens: {
                  accessToken: "eyJh...VCJ9.eyJ1...MjF9.PiaF...9dac",
                  refreshToken: "eyJh...VCJ9.eyJ1...MjF9.u2Ql...ftVY",
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "Authentication error",
    },
    403: {
      $ref: "#/components/responses/UnauthorizedError",
    },
  },
  security: [{ api_key: [] }],
};

const accessRouteDoc = {
  "/signup": {
    post: signUp,
  },
  "/login": {
    post: login,
  },
  "/logout": {
    post: logout,
  },
  "/handlerRefreshToken": {
    post: refreshToken,
  },
};

module.exports = accessRouteDoc;
