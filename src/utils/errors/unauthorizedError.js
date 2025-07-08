import AppError from './appError.js';

class UnauthorizedError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 401);
  }
}

export default UnauthorizedError;
