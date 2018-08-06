const router = require('express').Router();
const MovieService = require('../data-access/movies');
const GenreService = require('../data-access/genres')
const { validate } = require('../models/movie'); //object destruction
const movieService = new MovieService();
const genreService = new GenreService();

router.get('/', async(req, res) => {
    const movies = await movieService.getAll();
    res.send(movies);
});

router.get('/:id', async(req, res) => {
    const movie = await movieService.get(req.params.id);
    if(!movie) return res.status(404).send("Movie was not found.");
    res.send(movie);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await genreService.get(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');
    
    const movie = await movieService.create({ 
        title: req.body.title, 
        genre: { //store only the properties we need
            _id: genre._id,
            name: genre.name
        }, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate 
    });
    res.send(movie);
});

router.put('/:id', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await genreService.get(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    const movie = await movieService.update(req.params.id, { 
        title: req.body.title, 
        genre: { //store only the properties we need
            _id: genre._id,
            name: genre.name
        }, 
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    if(!movie) return res.status(404).send("Movie was not found.");
    res.send(movie);
});

router.delete('/:id', async(req, res) => {
    const movie = movieService.remove(req.params.id);
    if(!movie) return res.status(404).send("Movie was not found.");
    res.send(movie);
});

module.exports = router;