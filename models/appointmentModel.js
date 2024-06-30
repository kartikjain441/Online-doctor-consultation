const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    fees: {
      type: Number,
      required: true,
    },
    consulted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Appointment Model
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
