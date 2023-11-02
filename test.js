const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048, // Độ dài khóa
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

console.log("Public Key:");
console.log(publicKey);
console.log("Private Key:");
console.log(privateKey);

const JWT = require("jsonwebtoken");

// Payload cho AccessToken và RefreshToken
const payload = { user_id: 123, username: "example_user" };

// Tạo AccessToken và RefreshToken bằng privateKey
const accessToken = JWT.sign(payload, privateKey, {
  algorithm: "RS256",
  expiresIn: "2 days",
});

const refreshToken = JWT.sign(payload, privateKey, {
  algorithm: "RS256",
  expiresIn: "7 days",
});

console.log("AccessToken:");
console.log(accessToken);
console.log("RefreshToken:");
console.log(refreshToken);

JWT.verify(accessToken, publicKey, (err, decode) => {
  if (err) {
    console.error(`error verify::`, err);
  } else {
    console.log(`decode verify::`, decode);
  }
});
