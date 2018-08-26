//require('express-async-errors');

const winston = require('winston');
//require('winston-mongodb');

module.exports = function() {
    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }), 
            winston.format.prettyPrint({ all: true })
        )
    }));// Not working
    winston.add(new winston.transports.File({ filename: 'uncaughtExceptions.log', handleExceptions: true }));
    winston.add(new winston.transports.File({filename: 'logfile.log'}));
    //winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/jvid-db', level: 'info' })); not working with integration testing
    //process object is an event emitter and raises a standard event called uncaughtException, this event is raised when we have an exception in the node process

    process.on('uncaughtException', (err) => {
        console.log('WE GOT AN UNCAUGHT EXCEPTION');
        winston.error(err.message, { message: err.message, stack: err.stack, timestamp: new Date().toString() }, null);
        setTimeout(() => {        
            process.exit(1);//it's best practice to exist the process if there is uncaught exception
        }, 4000); //exit the process after 4 seconds which will give winston enough time to log the error
    }); 

    process.on('unhandledRejection', (err) => {
        console.log('WE GOT AN UNHANDLED REJECTION');
        winston.error(err.message, { message: err.message, stack: err.stack, timestamp: new Date().toString() }, null);
        setTimeout(() => {        
            process.exit(1);
        }, 4000);
    }); 
    /* THIS DOES NOT WORK!!!!
    winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
    winston.add(new winston.transports.File({
        filename: 'uncaughtExceptions.log',
        handleExceptions: true
    }));
    process.on('unhandledRejection', (err) => {
        throw err;//a workaround for winston exceptionHandler to handle unhandled Rejections
    });
    */
}