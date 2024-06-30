const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const isAuthenticated = require("../middlewares/authMiddleware").protect;
const isPatient = require("../middlewares/authMiddleware").isPatient;

// all user related routes

// get all appointments
router
  .route("/:id/appointments")
  .get(isAuthenticated, isPatient, userController.getAllAppointments);

router.route("/signUp").post(userController.signUp);
router.route("/login").post(userController.loginUser);

// booking appointment route
router
  .route("/book-an-appointment")
  .post(isAuthenticated, userController.bookAnAppointment);

module.exports = router;
