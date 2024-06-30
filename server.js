const express = require("express");
const app = express();
const connectDb = require("./database");
const middlewares = require("./middlewares/errorMiddlewares");
const cors = require("cors");
const server = require("http").createServer(app);

// io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// All routers
const doctorsRouter = require("./routes/doctorRoutes");
const usersRouter = require("./routes/userRoutes");
const paymentRouter = require("./routes/paymentRoutes");

// setting up connection to the database
connectDb();

// parsing the incoming data in req.body
app.use(express.json());

// Using cors to anable cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//  api routes for doctors
app.use("/api/doctors", doctorsRouter);
app.use("/api/users", usersRouter);
app.use("/api/payment", paymentRouter);

// If a page is not found
app.use(middlewares.notFound);

// global error handler middleware
app.use(middlewares.errorHandler);

// setting up the server
server.listen(5000, () => {
  console.log("Server Started!");
});

// on connection
io.on("connection", function (socket) {
  // join room event
  socket.on("join-room", function (data) {
    socket.join(data.roomId);
  });

  // disconnection event
  socket.on("disconnect", () => {
    console.log("User disconnecting");
  });

  // event when the user will be calling
  socket.on("callUser", function (data) {
    socket.broadcast.to(data.userToCall).emit("receiving-call", {
      signalData: data.signalData,
    });

    // io.sockets.in(data.userToCall).emit("receiving-call", {
    //   signalData: data.signalData,
    // });
  });

  // event emitted when the user will accept the call
  socket.on("acceptCall", (data) => {
    socket.broadcast.to(data.to).emit("callAccepted", {
      signalData: data.signalData,
    });

    // io.sockets.in(data.to).emit("callAccepted", {
    //   signalData: data.signalData,
    // });
  });

  // end call event
  socket.on("end-call", (data) => {
    // sending end call event to the patient
    socket.broadcast.to(data.roomId).emit("end-call");
  });
});
