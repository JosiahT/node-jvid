const helmet = require('helmet');
const compression = require('compression');
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");

module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
    app.use(morgan("tiny")); //use different formats depending on your needs
    startupDebugger("Morgan enabled...");
}