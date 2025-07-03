const User = require('../models/userModel');

// @desc Register (Create) a new user

const registerUser = async (req, res) => {
    try {
        const {
            first_name, 
            last_name, 
            password, 
            email, 
            role,
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

        res.status(201).json({
            first_name: user.first_name, 
            last_name: user.last_name, 
            email: user.email, 
            role: user.role,
        });

    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}


module.exports = {
    registerUser,
};


