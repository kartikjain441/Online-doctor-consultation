const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// routes for payment via razorpay integration
router.post("/orders", paymentController.createRazorPayOrder);
router.post("/success", paymentController.paymentSuccess);

module.exports = router;
