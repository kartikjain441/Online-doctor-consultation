const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const Doctor = require("./../models/doctorModel");

//this middleware will be used for protected routes
//it will check whether the user is authenticated or not
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "abcde");

      // while creating the headers you make have created the header in captial but in req.headers the key becomes lowercase completely and value becomes a string
      // If the user is not a doctor
      if (req.headers.doctor === "no") {
        req.user = await User.findById(decoded.id).select("-password");
      }
      // If user is a doctor
      else {
        req.user = await Doctor.findById(decoded.id).select("-password");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// checking whether the user accessing a route is a doctor or not
// isDoctor route
exports.isDoctor = asyncHandler(async (req, res, next) => {
  // Checking whether the user accessing the route is a doctor or not
  if (req.user && req.user.isDoctor) {
    next();
  } else {
    res.status(401);
    throw new Error("Only doctors can access this route..!");
  }
});

// checking whether the user accessing a route is a patient or not
// isPatient route
exports.isPatient = asyncHandler(async (req, res, next) => {
  // Checking whether the user accessing the route is a patient or not
  if (req.user && !req.user.isDoctor) {
    next();
  } else {
    res.status(401);
    throw new Error("Only patients can access this route..!");
  }
});
