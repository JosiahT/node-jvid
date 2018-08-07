const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        minlength: 2,
        maxlength: 255
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8,
        maxlength: 1024
    }
}));

function validateUser(user){
    const schema = {
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().regex(/.+@.+\..+/).min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;