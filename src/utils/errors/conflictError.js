import AppError from './appError.js';

// extends means inherit from AppError
class ConflictError extends AppError {
  constructor(message = 'Conflict: Duplicate entry') {
    super(message, 409);
  }
}

export default ConflictError;
