const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    isGold: { type: Boolean, default: false },
    phone: {
        type: String,
        required: true
    }
}));
    
function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.bool(),
        phone: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;