/*const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");*/
const auth = require("../middleware/auth");
const validate = require('../middleware/validate');
const router = require("express").Router();
const RentalService = require("../data-access/rentals");
const validateReturns = require("../models/returns");

router.post("/", [auth, validate(validateReturns)], async (req, res) => {
  
  let rental = await RentalService.getBy(req.body.customerId, req.body.movieId);
  if (rental) {
    if(rental.dateOfReturn) return res.status(400).send("rental already processed");    
    
    rental = await RentalService.update(rental);
    return res.send(rental);
  }
  else
    return res.status(404).send("rental not found");
});

module.exports = router;
