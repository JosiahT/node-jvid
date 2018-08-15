const winston = require('winston');
require('winston-mongodb');
//winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/jvid-db'}));
module.exports = function(err, req, res, next){ 
    console.log('hey there', err.message);
    winston.log({level: 'error', message: err.message, meta: err});
    //or you can use the code below
    //winston.error(err.message, { message: err.message, stack: err.stack, timestamp: new Date().toString() }, null);

    //log levels: error (most important), warn, info (storing info about your application like "connected to mongoDB..."), verbose, debug, silly
    
    res.status(500).send('Something went wrong in the server.');
}