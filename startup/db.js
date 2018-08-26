
const winston = require('winston');
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const config = require('config')

module.exports = function() {
    mongoose.connect(config.get('db'), { useNewUrlParser: true })
            .then(() => winston.info(`connected to ${config.get('db')}...`));//we don't need the catch block as it will be handled by error handler
            //.then(() => dbDebugger('connected to the MongoDB...'))
            //.catch(err => dbDebugger('Could not connect to MongoDB...', err));
}