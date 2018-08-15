const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = require('express').Router();
const GenreService = require('../data-access/genres');
const { validate } = require('../models/genre');

const genreService = new GenreService();

router.get('/', asyncMiddleware(async (req, res) => {
    throw new Error('could not get the genres');
    const genres = await genreService.getAll();
    res.send(genres);
}));

router.get('/:id', asyncMiddleware(async(req, res) => {
    const genre = await genreService.get(req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    res.send(genre);
}));

router.post('/', auth, asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await genreService.create({ name: req.body.name });
    res.send(genre);
}));

router.put('/:id', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await genreService.update(req.params.id, { name: req.body.name });
    if(!genre) return res.status(404).send("Genre was not found.");
    res.send(genre);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async(req, res) => {//apply to middleware functions auth->admin
    const genre = await genreService.remove(req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    res.send(genre);
}));

module.exports = router;