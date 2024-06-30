const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const Doctor = require("./../models/doctorModel");
const generateToken = require("./../utils/generateToken").generateToken;
const Appointment = require("./../models/appointmentModel");

// Signing Up users
exports.signUp = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  // checking whether password anc confirm password are matching or not
  if (confirmPassword !== password) {
    throw new Error("Password do not match...!");
  }

  // Checking if the user with that email already exists or not
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    throw new Error("User already registered with this email");
  }

  // If user doesn't exist then storing the user in the datbase
  const user = await User.create({
    firstName,
    email,
    lastName,
    password,
  });


  if (user) {
    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isDoctor: user.isDoctor,
      image: user.image,
      token: generateToken(user._id),
    });
  } else {
    res.status(404).json("Invalid Credentials");
  }
});

// Logging up users
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, isDoctorCheck } = req.body;
  console.log(isDoctorCheck);

  // if login details are entered by a patient
  if (!isDoctorCheck) {
    // finding the user first with the email
    const user = await User.findOne({ email: email });

   

    // If user found
    if (!user) {
      res.status(404);
      throw new Error("Email is Invalid....!");
    }

    if (user && (await user.comparePassword(password))) {

      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isDoctor: user.isDoctor,
        image: user.image,
        token: generateToken(user._id),
      });
    } else {
      res.status(404);
      throw new Error("Entered Password is wrong....!");
    }
  }

  // If login details are entered by a doctor
  else {
    // finding the doctor first with the email
    const doctor = await Doctor.findOne({ email: email });

    // If doctor not found
    if (!doctor) {
      res.status(404);
      throw new Error("Email is Invalid....!");
    }

    if (doctor && (await doctor.comparePassword(password))) {
      res.status(200).json({
        _id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        isDoctor: doctor.isDoctor,
        education: doctor.education,
        speciality: doctor.speciality,
        fees: doctor.fees,
        experience: doctor.experience,
        patientsConsulted: doctor.patientsConsulted,
        treatments: doctor.treatments,
        image: doctor.image,
        rating: doctor.rating,
        token: generateToken(doctor._id),
      });
    } else {
      res.status(404);
      throw new Error("Entered Password is wrong....!");
    }
  }
});

// book an appointment
exports.bookAnAppointment = asyncHandler(async (req, res, next) => {
  const { appointmentDate, slot, doctorId, fees } = req.body;
  const startTime = slot.split("-")[0];
  const endTime = slot.split("-")[1];

  // checking if the appointment with the same date and slot is present or not
  const appointment = await Appointment.find({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    startTime,
    endTime,
  });

  // If the appointment already exists then we need to throw a message
  if (appointment && appointment.length !== 0) {
    return res.status(200).json({
      status: "Error",
      message:
        "Oops your appointment was not booked because the doctor is not available at alloted date and slot.Please select some other slot or date.",
    });
  }

  // Creating an appointment
  const newAppointment = await Appointment.create({
    startTime,
    endTime,
    appointmentDate,
    doctor: doctorId,
    patient: req.user._id,
    fees: fees,
  });

  // If the new appointment is created then
  // Adding appointments to the user and doctors collection

  if (newAppointment && newAppointment._id) {
    // savind the appointment id in the user document
    const user = await User.findById(req.user._id);
    user.appointments.push(newAppointment._id);
    await user.save();

    // saving the appointment id in the doctor document
    const doctor = await Doctor.findById(doctorId);
    doctor.appointments.push(newAppointment._id);
    await doctor.save();
  }

  res.status(200).json({
    status: "Success",
    message:
      "Wait for some time for the confirmation of your appointment.You will be recieving a mail on your gmail regarding the status of your appointment.",
  });
});

// get all users appointments
exports.getAllAppointments = asyncHandler(async (req, res, next) => {
  // getting all the  appointments

  // Checking whether the user requesting for appointments is real user or some other user
  // One user cannot get other user's appointments
  // req.user._id will be of type object id so we need to convert it into string

  if (req.params.id.toString() !== req.user._id.toString()) {
    throw new Error("You can't access other user's appointments");
  }

  const appointments = await Appointment.find({
    patient: req.params.id,
  }).populate("patient doctor");

  console.log(appointments);
  res.status(200).json(appointments);
});
