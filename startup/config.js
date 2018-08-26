
const config = require('config');

module.exports = function(app) {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`pass: ${process.env.jvid_password}`);
    console.log(`app: ${app.get('env')}`);
    
    //configuration not working at the moment
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');//our global error handler will take care the rest
    }
    console.log('Application Name: ' + config.get('name'));
    //console.log('Mail Server: ' + config.get('mail.host'));
    //console.log('Mail Password: ' + config.get('mail.password')); //doesn't work
}