const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet =  require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/users');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

const PORT = process.env.PORT || 3000;

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`pass: ${process.env.jvid_password}`);
console.log(`app: ${app.get('env')}`);

//configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password')); //doesn't work

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
if(app.get('env') === 'development'){
    app.use(morgan('tiny')); //use different formats depending on your needs
    startupDebugger('Morgan enabled...');
}

mongoose.connect('mongodb://localhost/jvid-db')
.then(() => dbDebugger('connected to the MongoDB...'))
.catch(err => dbDebugger('Could not connect to MongoDB...', err));

app.get('/', (req, res) => {
    res.render('index', { title: 'JVid', message: 'Hello World'});
    //res.send('Hello World');
});

app.use('/api/users', users);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.listen(PORT, () => console.log("Listening on PORT 3000...") );
