const router = require('express').Router();
const CustomerService = require('../data-access/customers');
const { validate } = require('../models/customer'); //object destruction
const customerService = new CustomerService();

router.get('/', async(req, res) => {
    const customers = await customerService.getAll();
    res.send(customers);
});

router.get('/:id', async(req, res) => {
    const customer = await customerService.get(req.params.id);
    if(!customer) return res.status(404).send("Customer was not found.");
    res.send(customer);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer = await customerService.create({ 
        name: req.body.name, 
        isGold: req.body.isGold, 
        phone: req.body.phone 
    });
    res.send(customer);
});

router.put('/:id', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer = await customerService.update(req.params.id, { 
        name: req.body.name, 
        isGold: req.body.isGold, 
        phone: req.body.phone 
    });
    if(!customer) return res.status(404).send("Customer was not found.");
    res.send(customer);
});

router.delete('/:id', async(req, res) => {
    const customer = customerService.remove(req.params.id);
    if(!customer) return res.status(404).send("Customer was not found.");
    res.send(customer);
});

module.exports = router;