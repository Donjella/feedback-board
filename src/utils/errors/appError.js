class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture the stack trace excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
