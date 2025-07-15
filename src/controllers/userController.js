import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import {
  ConflictError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
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

  if (!email || !password) {
    throw new ValidationError('Email and password are required.');
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
  if (!user) {
    throw new NotFoundError('Unable to retrieve user profile. User not found.');
  }
  res.status(200).json(user);
});

// @desc Delete own user profile
// @route DELETE /users/delete
// @access Protected, logged-in users only

const deleteOwnAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  res.status(200).json({
    message: 'You have successfully deleted your account',
    deletedUserId: req.user._id,
  });
});

// @desc Update own user profile
// @route PATCH /users/update
// @access Protected, logged-in users only

const updateOwnAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if(!user){
    throw new NotFoundError('User not found.')
  }

  
  if (req.body.first_name !== undefined) {user.first_name = req.body.first_name}
  if (req.body.last_name !== undefined) {user.last_name = req.body.last_name}

  if (req.body.email && req.body.email !== user.email) {
    const existingUser = await User.findOne({ email: req.body.email });
    if(existingUser){
      throw new ConflictError('Email already exists.');
    } else {
      user.email = req.body.email;
    }
  }

  if (req.body.password !== undefined) {
    user.password = req.body.password;
  };

  await user.save();

  const token = user.generateToken();

  res.status(200).json({
    message: 'Account details updated successfully',
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    token,
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

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(200).json(users);
});

// @desc Delete user by ID
// @routes /admin/users/:id
// @access Admin, admins only

const AdminDeleteUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    throw new ForbiddenError('Unauthorized. Only administrators allowed.');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found.');
  }

  res.status(200).json({
    message: 'User successfully deleted',
    deletedUserId: user._id,
  });
});

export { registerUser, loginUser, getUserProfile, deleteOwnAccount, getAllUsers, AdminDeleteUser, updateOwnAccount };
