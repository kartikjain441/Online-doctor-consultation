const jwt = require("jsonwebtoken");

// Function for generating a token for the user
exports.generateToken = (id) => {
  return jwt.sign({ id }, "abcde", {
    expiresIn: "30d",
  });
};
