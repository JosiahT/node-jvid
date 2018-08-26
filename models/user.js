const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
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
    },
    isAdmin: Boolean
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); 
    //replace user with this since the method is part of the userSchema object
    //it also means that we can't replace this function with an arrow function since this could change if we use the arrow function
    //arrow functions are useful for stand-alone functions not for methods of objects
    return token;
};
userSchema.methods.hashPassword = async function() {    
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
}

const User = mongoose.model('User', userSchema);

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