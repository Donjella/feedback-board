import AppError from './appError.js';

// extends means inherit from AppError
class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

export default ForbiddenError;
