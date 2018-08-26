const Joi = require('joi');

module.exports = function validateReturns(req) {
    const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema);
  };