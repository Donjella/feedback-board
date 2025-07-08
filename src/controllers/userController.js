const User = require('../models/userModel');

const { conflictError, validationError } = require('../utils/errors');

// @desc Register (Create) a new user

const registerUser = async (req, res, next) => {
  const role = 'Community Member';

  try {
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
  } catch (error) {
    // res.status(400).json({ error: error.message});
    next(error);
  }
};

module.exports = {
  registerUser,
};
