const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const { 
    conflictError, 
    validationError,
    UnauthorizedError,
} = require('../utils/errors');

// @desc Register (Create) a new user
// @route
// @access Public
const registerUser = asyncHandler (async (req, res, next) => {
  const role = 'Community Member';
  const { first_name, last_name, password, email } = req.body;

    const missingFields = [];
    if (!first_name) missingFields.push('first_name');
    if (!last_name) missingFields.push('last_name');
    if (!password) missingFields.push('password');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      throw new validationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const userExists = await User.findOne({ email });
    //    if(userExists){
    //     return res.status(400).json( {error: 'Email already in use' } );
    //    }

    if (userExists) {
      throw new conflictError('User with this email already exists.');
    }

    // Password Validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new validationError(
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
const loginUser = asyncHandler (async (req, res, next) => {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))){
      throw new UnauthorizedError('Incorrect login credentials provided');
    } else {
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
    }

});


module.exports = {
  registerUser,
  loginUser,
};
