const _ = require('lodash');
const auth = require('../middleware/auth');//autherization, not authentication
const router = require('express').Router();
const UserService = require('../data-access/users');
const { validate } = require('../models/user');

const userService = new UserService();

router.get('/', async(req, res) => {
    const users = await userService.getAll();
    res.send(users);
});

router.get('/me', auth, async(req, res) => {
    //so as not to let a client forge another user's id, we wont accept an id ('/:id') here and rather get the id from the jwt payload
    const user = await userService.get(req.user._id);
    console.log(req.user._id);
    if(!user) return res.status(404).send("User was not found.");
    res.send(user);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await userService.getByEmail(req.body.email);
    if(user) return res.status(400).send('User already registered.');
    
    user = await userService.create(_.pick(req.body, ['name', 'email', 'password']));
    
    const token = userService.generateAuthToken(user);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    //for any custom headers we define in our application, we should prefix the headers with 'x-<name>'
});

router.put('/:id', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await userService.update(req.params.id, { 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password 
    });
    if(!user) return res.status(404).send("User was not found.");
    res.send(user);
});

router.delete('/:id', async(req, res) => {
    const user = userService.remove(req.params.id);
    if(!user) return res.status(404).send("User was not found.");
    res.send(user);
});

module.exports = router;