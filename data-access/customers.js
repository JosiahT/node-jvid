const { Customer } = require('../models/customer'); //use object destructuring
class customerService{

    constructor(){
    }

    async create(_customer) {
        const customer = new Customer(_customer);
        try {
            return await customer.save();
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async getAll() {
        return Customer.find();
    }
    
    async get(_id) {
        return Customer.findById(_id);
    }
    
    async update(_id, _customer) {
        try {
            return await Customer.findByIdAndUpdate(_id, _customer, { new: true });
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async remove(_id) {
        try {
            return await Customer.findByIdAndRemove(_id);
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
}

module.exports = customerService;