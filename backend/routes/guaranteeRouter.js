const express = require('express');
const router = express.Router();
const guaranteeCtrl = require('../app/controllers/guaranteeCtrl');


router.get("/statistic-year/:id", guaranteeCtrl.statisticYear); 
router.post("/submit-gtf", guaranteeCtrl.submitGTF); // Return to the factory because it can't be fixed
router.post("/submit-gta", guaranteeCtrl.submitGTA); // confirm guarantee successfully
router.get("/insurancing/:id", guaranteeCtrl.showProductInsurancing); // id of guarantee
router.post("/submit-atg", guaranteeCtrl.submitOrderGuarantee); // guarantee submit order from agency
router.get('/', guaranteeCtrl.getAllGuarantees);



module.exports = router;