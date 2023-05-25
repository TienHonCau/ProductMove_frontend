const express = require("express");
const router = express.Router();
const agencyCtrl = require("../app/controllers/agencyCtrl");

router.get("/statistic-quarter/:id", agencyCtrl.statisticQuarter);
router.get("/statistic-year/:id", agencyCtrl.statisticYear);
router.post("/submit-atf", agencyCtrl.submitATF); // Return to the factory because it has not been sold for a long time
router.post("/submit-atc", agencyCtrl.returnToCustomer);
router.post("/submit-fta", agencyCtrl.submitDeliveryFromFactory);
router.post("/sell-product", agencyCtrl.sell); // sell products to customers
router.post("/order-guarantee", agencyCtrl.orderGuarantee); // make a order guarantee
router.get("/product-customers/:id", agencyCtrl.showProductCustomers); // id of agency
router.get("/storage/:id", agencyCtrl.getStorage); // id of agency
router.get("/", agencyCtrl.getAllAgencies);

module.exports = router;
