const Doctor = require("./models/doctorModel");
const connectDb = require("./database");
const doctors = require("./data/doctors");

// firstly connecting to database
connectDb();

const insertData = async () => {
  try {
    // deleting all the inserted data first
    await Doctor.deleteMany();

    // Inserting data
    const res = await Doctor.insertMany(doctors);
    console.log("Data imported Successfully");
    process.exit();
  } catch (err) {
    console.log("ERROR 💥💥", err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Doctor.deleteMany();
    console.log("DATA DESTORYED SUCCESSFULLY");
    process.exit();
  } catch (err) {
    console.log("ERROR 💥💥", err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else {
  insertData();
}
