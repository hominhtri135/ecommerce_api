const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config.mongodb");

const PORT = port;

const server = app.listen(PORT, () => {
  console.log(`API start: http://localhost:${PORT}/`);
  console.log(`Documentation: http://localhost:${PORT}/documentations`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log(`Exit Server Express`));
// });
