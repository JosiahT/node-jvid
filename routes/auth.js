const jwt = require('jsonwebtoken');
const config = require('config');
const router = require('express').Router();
const UserService = require('../data-access/users');
const { authenticate, validate } = require('../data-access/auth');

const userService = new UserService();

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await userService.getByEmail(req.body.email);
    if(!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await authenticate(req.body.password, user.password); //to compare a plain text password with a hash password
    //bcrypt will get the salt from user password and use that to rehash the plain text password
    if(!validPassword) return res.status(400).send('Invalid email or password.');
    
    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.send(token);
});

module.exports = router;