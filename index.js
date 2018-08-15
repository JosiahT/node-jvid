//require('express-async-errors');
const winston = require('winston');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet =  require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

const error = require('./middleware/error');
const auth = require('./routes/auth');
const users = require('./routes/users');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const app = express();

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
//process object is an event emitter and raises a standard event called uncaughtException, this event is raised when we have an exception in the node process

process.on('uncaughtException', (err) => {
    console.log('WE GOT AN UNCAUGHT EXCEPTION');
    winston.error(err.message, { message: err.message, stack: err.stack, timestamp: new Date().toString() }, null);
    process.exit(1);
}); 

process.on('unhandledRejection', (err) => {
    console.log('WE GOT AN UNHANDLED REJECTION');
    winston.error(err.message, 
        { message: err.message, stack: err.stack, timestamp: new Date().toString() }, 
        function(err, level, msg, meta) {
        process.exit(1);
    });
}); 
//winston.add(new winston.transports.File({filename: 'uncaughtExceptions.log', handleExceptions: true}));
//winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
/*
process.on('unhandledRejection', (err) => {
    throw err;
});
*/
//throw new Error('something failed during startup.');

const p = Promise.reject(new Error('Something failed miserably!'));
p.then(() => console.log('Done'));

app.set('view engine', 'pug');
app.set('views', './views');

const PORT = process.env.PORT || 3000;

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`pass: ${process.env.jvid_password}`);
console.log(`app: ${app.get('env')}`);
/*
//configuration
if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1); //exists the application with exit code (if code = 0  which means success and anything but 0 means failure)
}*/
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password')); //doesn't work

mongoose.connect('mongodb://localhost/jvid-db')
.then(() => dbDebugger('connected to the MongoDB...'))
.catch(err => dbDebugger('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if(app.get('env') === 'development'){
    app.use(morgan('tiny')); //use different formats depending on your needs
    startupDebugger('Morgan enabled...');
}

app.get('/', (req, res) => {
    res.render('index', { title: 'JVid', message: 'Hello World'});
    //res.send('Hello World');
});

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.use(error);

app.listen(PORT, () => console.log("Listening on PORT 3000...") );
