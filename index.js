const winston = require('winston');
const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')(app);
require('./startup/validation')();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => winston.info(`Listening on PORT ${PORT}...`) );

module.exports = server;