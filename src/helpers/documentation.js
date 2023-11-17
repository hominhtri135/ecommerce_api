const accessRouteDoc = require("~/routes/access/access.doc");

const swaggerDocumentation = {
  openapi: "3.0.3",
  info: {
    title: "Demo",
    version: "0.0.1",
    description: "this is a demo",
  },
  servers: [
    { url: "http://localhost:3056/v1/api/shop", description: "dev" },
    { url: "http://localhost:3000", description: "production" },
  ],
  tags: [{ name: "Access", description: "Access routes" }],
  paths: {
    ...accessRouteDoc,
  },
  components: {
    responses: {
      UnauthorizedError: {
        description: "API key is missing or invalid",
        headers: {
          WWW_Authenticate: {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
    securitySchemes: {
      api_key: {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  // security: [ // All security routes
  //   {
  //     bearerAuth: [],
  //   },
  //   {
  //     api_key: [],
  //   },
  // ],
};

module.exports = swaggerDocumentation;
