const express = require('express');
const router = express.Router();
const deliveryCtrl = require('../app/controllers/deliveryCtrl');


router.get('/fta/:id', deliveryCtrl.getAllFTA); // id of factory, returns all transactions exported by this factory
router.get('/fta-delivering/:id', deliveryCtrl.getDeliveringFTA); // id of agency, returns all transactions that this agency imported from the factory
router.get('/atc/:id', deliveryCtrl.getAllATC);
router.get('/atg-delivering/:id', deliveryCtrl.getDeliveringATG); // id of gurantee, returns all order guarantee that this guarantee imported from the agency
router.get('/atg/:id', deliveryCtrl.getAllATG); // id of agency, returns all order guarantee by this agency



module.exports = router;