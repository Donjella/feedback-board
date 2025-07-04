const AppError = require('./appError');

// extends means inherit from AppError
class ConflictError extends AppError {
    constructor(message = 'Conflict: Duplicate entry'){
        super(message, 409);
    }
}

module.exports = ConflictError;