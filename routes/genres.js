const router_g = require('express').Router();
const GenreService = require('../data-access/genres');

const genreService = new GenreService();

router_g.get('/', async(req, res) => {
    const genres = await genreService.getAll();
    res.send(genres);
});

router_g.get('/:id', async(req, res) => {
    const genre = await genreService.get(req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    res.send(genre);
});

router_g.post('/', async(req, res) => {
    const { error } = genreService.validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await genreService.create({ name: req.body.name });
    res.send(genre);
});

router_g.put('/:id', async(req, res) => {
    let genre = await genreService.get(req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    const { error } = genreService.validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    genre = await genreService.update(req.params.id, { name: req.body.name });
    res.send(genre);
});

router_g.delete('/:id', async(req, res) => {
    let genre = await genreService.get(req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    genre = genreService.remove(req.params.id);
    res.send(genre);
});

module.exports = router_g;