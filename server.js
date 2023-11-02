const app = require("./src/app");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with PORT: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log(`Exit Server Express`));
// });
