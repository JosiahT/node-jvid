module.exports = function(err, req, res, next){ //err is the error/exception we catch somewhere in the application
    //we add all the logic for handling errors in our application
    res.status(500).send('Something went wrong in the server.');
}