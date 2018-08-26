const request = require("supertest");
const { User } = require("../../models/user");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const moment = require('moment');

describe("/api/returns", () => {
  let server, rental, customerId, movieId, token, movie;

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: {
        name: '12345'
      },
      numberInStock: 7
    });
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345"
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2
      }
    });
    await movie.save();
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId }); //use ES6 syntax for objects of same key and value
    //in ES6 if key and value are the same for an object like {name: name}, we can rewrite it as {name}
  };
  //testing the Authorization
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  //testing the Input
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    //alternate approach is to define the payload outside and then do delete payload.customerId
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  //testing looking up an object
  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });
  //testing if rental is processed
  it("should return 400 if rental already processed", async() => {
    rental.dateOfReturn = new Date();
    await Rental.findByIdAndUpdate(rental._id, rental, { new: true });

    const res = await exec();

    expect(res.status).toBe(400);
  });
  //testig the valid request
  it("should return 200 if valid request", async() => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
  //testig return date
  it("should set the returnDate if input is valid", async() => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id); //reason for this is rental is in memory and it's date is changed but we need to make sure the change persisted in the db
    expect(rentalInDb.dateOfReturn).toBeDefined();//too general
    const diff = new Date() - rentalInDb.dateOfReturn;
    expect(diff).toBeLessThan(30 * 1000); //difference should be less than 30 seconds
  });
  //testing the Rental Fee
  it("should return the rentalFee if input is valid", async() => {
    rental.dateOfRental = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBeGreaterThan(0);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  //testing the movie stock
  it("should increase the movie stock if input is valid", async() => { 
    const res = await exec();

    movieInDb = await Movie.findById(movie._id);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
  //testing the response
  it('should return the rental if input is valid', async() => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(res.body).toHaveProperty('customer._id', rentalInDb.customer._id.toString());
    expect(res.body).toHaveProperty('movie._id', rentalInDb.movie._id.toString());

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(
        ['dateOfRental', 'dateOfReturn', 'rentalFee', 'customer', 'movie']
      ));
  })
});
