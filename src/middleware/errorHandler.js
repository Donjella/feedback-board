import AppError from '../utils/errors/appError.js';

const errorHandler = (err, req, res, _next) => {
  // Default Values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // If the error is an instance of AppError (custom errors like ValidationError, ConflictError, etc.)
  // Use the statusCode and message set in its constructor
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Mongoose validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Handle Mongoose bad ObjectId (e.g. invalid :id in route param)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle MongoDB duplicate key error
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
  }

  // JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token, Please log in again';
  }

  // Log detailed error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('ErrorHandler:', err);
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Oops! Something went wrong on our end';
  }

  // Respond with error message and stack (only in dev)
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
