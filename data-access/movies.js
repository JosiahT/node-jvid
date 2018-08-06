const { Movie } = require('../models/movie'); //use object destructuring
class movieService{

    constructor(){
    }

    async create(_movie) {
        const movie = new Movie(_movie);
        try {
            return await movie.save();
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async getAll() {
        return Movie.find();
    }
    
    async get(_id) {
        return Movie.findById(_id);
    }
    
    async update(_id, _movie) {
        try {
            return await Movie.findByIdAndUpdate(_id, _movie, { new: true });
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async remove(_id) {
        try {
            return await Movie.findByIdAndRemove(_id);
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
}

module.exports = movieService;