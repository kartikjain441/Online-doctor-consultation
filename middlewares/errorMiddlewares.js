// middleware for creating error for not found pages
exports.notFound = (req, res, next) => {
  const error = new Error(`Page not found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// this is the express global error handler middleware
exports.errorHandler = (err, req, res, next) => {
  console.log(err.message);
  // sometimes the status code can be 200 so wee need to set it explicitly
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: "failed",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "null" : err.stack,
  });
};
