import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import asyncHandler from 'express-async-handler';
import { NotFoundError, UnauthorizedError } from '../utils/errors';

// Middleware to protect routes (Users must be logged in)
const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthorizedError('Not authorised, no token provided');
    } else {

    const [, token] = req.headers.authorization.split(' ');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user){
        throw new NotFoundError('Unauthorised. User not found');
    }
    }

    next();
});

// middleware to check Admin role
const adminOnly = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role !=='admin') {
    throw new UnauthorizedError('Not authorized. Only Admin access.')
    }
    next();
});




