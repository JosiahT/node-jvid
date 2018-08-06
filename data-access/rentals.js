const { Rental } = require('../models/rental'); //use object destructuring
const transaction = require('./transaction')
class rentalService{

    constructor(){
    }

    async create(_rental, _movie) {
        const rental = new Rental(_rental);
        try {
            await transaction.submitRental(rental, _movie);
            return rental;
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async getAll() {
        return Rental.find().sort('-dateReturned');
    }
    
    async get(_id) {
        return Rental.findById(_id);
    }
    
    async update(_id, _rental) {
        try {
            return await Rental.findByIdAndUpdate(_id, _rental, { new: true });
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async remove(_id) {
        try {
            return await Rental.findByIdAndRemove(_id);
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
}

module.exports = rentalService;