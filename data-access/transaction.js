const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Movie} = require('../models/movie');
Fawn.init(mongoose);

function submitRental(_rental, _movie){
    const movie = new Movie(_movie);
    return new Fawn.Task()
        .save('rentals', _rental)
        .update('movies', { _id: movie._id}, {
            $inc: { numberInStock: -1 }
        })
        .run();
}

function processRental(_rental) {    
    return new Fawn.Task()
        .update('rentals', {_id: _rental._id}, {
            dateOfReturn: _rental.dateOfReturn,
            rentalFee: _rental.rentalFee
        })
        .update('movies', { _id: _rental.movie._id}, {
            $inc: { numberInStock: 1 }
        })
        .run();
}

exports.submitRental = submitRental;
exports.processRental = processRental;