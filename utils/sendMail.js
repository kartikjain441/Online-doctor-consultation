const nodemailer = require("nodemailer");

// creating transporter for mail which will contain the service used to send the mail and sender authentication details
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "livedoctor7@gmail.com",
    // gmail app-specific password for less secure apps
    pass: process.env.GMAIL_PASSWORD,
  },
  //   Search why we used this
  tls: {
    rejectUnauthorized: false,
  },
});

// //Mail details like sender,reciever,subject,text
// let mailDetails = {
//   from: "livedoctor7@gmail.com",
//   to: "pancholipratham33@gmail.com",
//   subject: "Test Mail",
//   text: "Node.js testing mail LiveDoctor",
// };

//function for sending mails
const sendMail = async (mailDetails) => {
  try {
    await mailTransporter.sendMail(mailDetails);
    console.log("Email sent successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
