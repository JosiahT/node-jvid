const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

let rentalSchema = new mongoose.Schema({
    customer: { 
        type: new mongoose.Schema({
            name: { 
                type: String, 
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: { type: Boolean, default: false },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }), 
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: { 
                type: String, 
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 255
            },
            dailyRentalRate: { //to calculate the rental fee
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOfRental: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateOfReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.methods.return = function() {
    this.dateOfReturn = new Date(); 
    
    //this.rentalFee = Math.ceil((this.dateOfReturn - this.dateOfRental)/(1000 * 3600 * 24)) * this.movie.dailyRentalRate; 
    const rentalDays = moment().diff(this.dateOfRental, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);


    
function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;