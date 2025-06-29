const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [1, 'First name must be at least 1 characters'],
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        last_name: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters'],
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        role: {
            type: String,
            required: true,
            enum: ['Community Member', 'Admin'],
            default: 'Community Member',
        },
    },
    {
        timestamps: true,
    },
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;