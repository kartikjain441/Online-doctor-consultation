const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Doctor Schema
const doctorSchema = mongoose.Schema(
  {
    firstName: {
      type: "String",
      required: true,
    },
    image: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    isDoctor: {
      type: Boolean,
      required: true,
      default: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    treatments: [
      {
        type: String,
        required: true,
      },
    ],
    experience: {
      type: Number,
      required: true,
    },
    patientsConsulted: {
      type: Number,
      required: true,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);

// method for comparing password during login time
// this method will be called on the instance
doctorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Doctor Model
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
