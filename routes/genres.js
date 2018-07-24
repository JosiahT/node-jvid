const Joi = require('joi');
const router_g = require('express').Router();

const genres = [
    {id: 1, name: 'genre 1'},
    {id: 2, name: 'genre 2'},
    {id: 3, name: 'genre 3'}
];

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

router_g.get('/', (req, res) => {
    res.send(genres);
});

router_g.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === +req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    res.send(genre);
});

router_g.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

router_g.put('/:id', (req, res) => {
    let genre = genres.find(g => g.id === +req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    genre.name = req.body.name;
    res.send(genre);
});

router_g.delete('/:id', (req, res) => {
    let genre = genres.find(g => g.id === +req.params.id);
    if(!genre) return res.status(404).send("Genre was not found.");
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

module.exports = router_g;