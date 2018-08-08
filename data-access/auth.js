const bcrypt = require('bcrypt');
const Joi = require('joi');

function validateAuth(req){
    const schema = {
        email: Joi.string().regex(/.+@.+\..+/).min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(req, schema);
}

async function authenticate(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword); //to compare a plain text password with a hash password
    //bcrypt will get the salt from user password and use that to rehash the plain text password
}

exports.authenticate = authenticate;
exports.validate = validateAuth;