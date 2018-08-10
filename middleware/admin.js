const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
    //401 Unauthorized: when a user tries to access a protected resource but they don't supply a valid jwt (try with valid web token :D)
    //403 Forbidden: the user sends a valid jwt but is not allowed to access the resource (don't try again :D)
    //we will access req.user from auth middleware
    if(!req.user.isAdmin) return res.status(403).send('Access denied');
    next();
}