import AppError from './appError.js';

class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, 400);
  }
}

export default ValidationError;
