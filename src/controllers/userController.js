const User = require('../models/userModel');

// @desc Register (Create) a new user

const registerUser = async (req, res) => {

    const role = 'Community Member';

    try {
        const {
            first_name, 
            last_name, 
            password, 
            email, 
        }
       = req.body;

       const userExists = await User.findOne( {email} );
       if(userExists){
        return res.status(400).json( {error: 'Email already in use' } );
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
        res.status(400).json({ error: error.message});
    }
}


module.exports = {
    registerUser,
};


