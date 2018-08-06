const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Movie} = require('../models/movie');
Fawn.init(mongoose);

function submitRental(rental, _movie){
    const movie = new Movie(_movie);
    return new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id}, {
            $inc: { numberInStock: -1 }
        })
        .run();
}

exports.submitRental = submitRental;