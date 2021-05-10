const AppError = require('../utils/AppError');

/**
 * Handles JWT errors.
 */
const handleJWTError = () =>
  new AppError('Invalid token! Please log in again!', 401);

/**
 * Returns an error in the development version.
 */
const sendErrorDevelopment = (err, req, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

/**
 * Returns an error in the production version (don't show the user the error log).
 * If there's an untrusted error, do not leak error details. Simply log it to the console.
 * Don't forget to display the generic message.
 */
const sendErrorProduction = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('ERROR (💥): ', err);
  return res.status(500).json({
    status: 'error',
    message: 'Please try again later!',
  });
};

/**
 * Our global error handling middleware.
 */
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    sendErrorProduction(error, req, res);
  }
};

module.exports = errorMiddleware;
