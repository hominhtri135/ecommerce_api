require("dotenv").config();
const path = require("path");
require("module-alias/register");
const compression = require("compression");
const cors = require("cors");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const swaggerDoc = require("swagger-ui-express");
const swaggerDoccumentation = require("~/helpers/documentation");
const app = express();

// cors
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

// access public folder
app.use(express.static("public"));

// console.log(`Process::`, process.env);
// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("~/dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

// Swagger Documentation API
app.use(express.static(__dirname));
app.use("*.css", (req, res, next) => {
  res.set("Content-Type", "text/css");
  next();
});
var options = {
  explorer: true,
  // customCssUrl: "/swagger/themes/theme-material.css",
  // customCss: ".swagger-ui .topbar { display: none }",
};

app.use(
  "/documentations",
  swaggerDoc.serve,
  swaggerDoc.setup(swaggerDoccumentation, options)
);

// init routes
app.use(require("~/routes"));

// handling errors
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack, // hien thi chi tiet loi o dau
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
