const { Rental } = require("../models/rental"); //use object destructuring
const transaction = require("./transaction");
class rentalService {

  static async create(_rental, _movie) {
    const rental = new Rental(_rental);
    try {
      await transaction.submitRental(rental, _movie);
      return rental;
    } catch (ex) {
      console.log(ex.message);
      return null;
    }
  }

  static async getAll() {
    return Rental.find().sort("-dateReturned");
  }

  static async get(_id) {
    return Rental.findById(_id);
  }

  static async getBy(customerId, movieId) {
    try {
      return await Rental.findOne({
        "customer._id": customerId,
        "movie._id": movieId
      });
    } catch (ex) {
      console.log(ex.message);
      return null;
    }
  }

  static async update(_rental) {
    const rental = new Rental(_rental);
    rental.return();
    try {
      await transaction.processRental(rental);
      return rental;
    } catch (ex) {
      console.log(ex.message);
      return null;
    }
  }

  static async remove(_id) {
    try {
      return await Rental.findByIdAndRemove(_id);
    } catch (ex) {
      console.log(ex.message);
      return null;
    }
  }
}

module.exports = rentalService;
