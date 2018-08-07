const { User } = require('../models/user');
class userService{

    constructor(){
    }

    async create(_user) {
        const user = new User(_user);
        try {
            return await user.save();
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async getAll() {
        return await User.find();
    }
    
    async get(_id) {
        return await User.findById(_id);
    }

    async getByEmail(_email) {
        return await User.findOne({ email: _email });
    }
    
    async update(_id, _user) {
        try {
            return await User.findByIdAndUpdate(_id, _user, { new: true });
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
    
    async remove(_id) {
        try {
            return await User.findByIdAndRemove(_id);
        }
        catch(ex){
            console.log(ex.message);
            return null;
        }
    }
}

module.exports = userService;