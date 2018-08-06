const Joi = require('joi');
const mongoose = require('mongoose');
const {Genre} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255
    },
    genre: {
        type: Genre.schema,
        required: true
    },
    numberInStock:  {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));
    
function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(2).max(255).required(),
        /*
        genre: Joi.object({
            _id: Joi.string(),
            name: Joi.string()
        }).required(),
        */
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;