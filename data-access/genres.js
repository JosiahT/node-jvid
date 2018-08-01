const Joi = require('joi');
const mongoose = require('mongoose');
class genreService{

    constructor(){
        mongoose.connect('mongodb://localhost/jvid-db')
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
        this.genreSchema = new mongoose.Schema({
            name: { type: String, required: true, set: v => v.charAt(0).toUpperCase() + v.slice(1)}
        });
        this.Genre = mongoose.model('Genre', this.genreSchema);
    }

    async create(_genre) {
        const genre = new this.Genre(_genre);
        try {
            const result = await genre.save();
            return genre;
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async getAll() {
        return this.Genre.find();
    }
    
    async get(_id) {
        return this.Genre.findById(_id);
    }
    
    async update(_id, _genre) {
        const genre = await this.Genre.findById(_id);
        if(!genre) return;
        genre.name = _genre.name;
        try {
            const result = await genre.save();
            console.log(result);
            return genre;
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async remove(_id) {
        try {
            const genre = await Genre.findByIdAndRemove(_id);
            console.log(genre);
            return genre;
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    validateGenre(genre){
        const schema = {
            name: Joi.string().min(3).required()
        };
        return Joi.validate(genre, schema);
    }
}

module.exports = genreService;