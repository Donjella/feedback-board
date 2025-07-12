import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import {
  ConflictError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from '../utils/errors/index.js';

// @desc Register (Create) a new user
// @route
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const role = 'Community Member';
  const { first_name, last_name, password, email } = req.body;

  const missingFields = [];
  if (!first_name) missingFields.push('first_name');
  if (!last_name) missingFields.push('last_name');
  if (!password) missingFields.push('password');
  if (!email) missingFields.push('email');

  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ConflictError('User with this email already exists.');
  }

  // Password Validation
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ValidationError(
      'Password must be at least 8 characters and contain both letters and numbers.'
    );
  }

  const user = await User.create({
    first_name,
    last_name,
    password,
    email,
    role,
  });

  // Generate JWT token from the user instance
  const token = user.generateToken();

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// Authenticate user & get token
// @route
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password){
    throw new ValidationError('Email and password are required.')
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('Incorrect login credentials provided.');
  }

  // Generate JWT token
  const token = user.generateToken();

  res.status(200).json({
    message: 'Login Successful',
    token,
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  });
});

/* 
=============================================
User Routes (Protected routes)
=============================================
*/

// @desc Get user profile
// @route /users/profile
// @access Private, logged-in users only

const getUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id).select('-password');
  if (!user){
    throw new NotFoundError('Unable to retrieve user profile. User not found');
  }
  res.status(200).json(user);
});

// @desc Delete own user profile
// @route /users/delete
// @access Private, logged-in users only

const deleteOwnAccount = asyncHandler(async (req, res) => {

  const user = await User.findByIdAndDelete(req.user._id);

  if (!user){
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    message: 'You have successfully deleted your account',
    deletedUserId: req.user._id,
  });
});



/* 
=============================================
Admin-only Routes 
=============================================
*/

// @desc Get all users
// @routes /admin/users
// @access Admin, admins only

const getAllUsers = asyncHandler(async (req, res,) => {
  const users = await User.find().select('-password');
 
  res.status(200).json(users);
});


export { registerUser, loginUser, getUserProfile, deleteOwnAccount, getAllUsers };
