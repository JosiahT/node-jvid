const { Genre } = require('../models/genre');
class genreService{

    constructor(){
    }

    async create(_genre) {
        const genre = new Genre(_genre);
        try {
            return await genre.save();
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async getAll() {
        return Genre.find();
    }
    
    async get(_id) {
        return Genre.findById(_id);
    }
    
    async update(_id, _genre) {
        try {
            return await Genre.findByIdAndUpdate(_id, _genre, { new: true });
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async remove(_id) {
        try {
            return await Genre.findByIdAndRemove(_id);
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
}

module.exports = genreService;