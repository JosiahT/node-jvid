const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {//we use next to pass control to the next middleware function
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.');
    try{
        const decoded = jwt.verify(token, 'jwtPrivateKey'); //config.get('jwtPrivateKey')); 
        req.user = decoded; //assign user property of the request the payload and pass to the next middleware
        next();
    } catch(ex){
        res.status(400).send('Invalid token.');
    }
    //if it is valid, jwt.verify() returns the payload. Otherwise, it throws an exception
}