const router = require('express').Router();
const RentalService = require('../data-access/rentals');
const MovieService = require('../data-access/movies');
const CustomerService = require('../data-access/customers');
const transaction = require('../data-access/transaction');
const { validate } = require('../models/rental'); //object destruction

const rentalService = new RentalService();
const movieService = new MovieService();
const customerService = new CustomerService();

router.get('/', async(req, res) => {
    const rentals = await rentalService.getAll();
    res.send(rentals);
});

router.get('/:id', async(req, res) => {
    const rental = await rentalService.get(req.params.id);
    if(!rental) return res.status(404).send("Rental was not found.");
    res.send(rental);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await customerService.get(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer.');
    
    const movie = await movieService.get(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie.');

    if(movie.numberInStock === 0) return res.status(400).send('Movie is out of stock.');
    try {
        const rental = await rentalService.create({ 
            customer: { //store only the properties we need
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            } 
        }, movie);
        res.send(rental);
    }
    catch(ex) {
        res.status(500).send("Something failed.");
    }    
});

router.put('/:id', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await customerService.get(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer.');
    
    const movie = await movieService.get(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie.');

    const rental = await rentalService.update(req.params.id, { 
        customer: { //store only the properties we need
            _id: customer._id,
            name: customer.name
        }, 
        movie: {
            _id: movie._id,
            title: movie.title
        } 
    });
    if(!rental) return res.status(404).send("Movie was not found.");
    res.send(rental);
});

router.delete('/:id', async(req, res) => {
    const rental = rentalService.remove(req.params.id);
    if(!rental) return res.status(404).send("Movie was not found.");
    res.send(rental);
});

module.exports = router;