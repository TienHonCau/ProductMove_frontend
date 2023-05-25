const express = require("express");
const router = express.Router();
const adminCtrl = require("../app/controllers/adminCtrl");

router.get("/statistic-all", adminCtrl.statisticAll);
router.get("/statistic-factory", adminCtrl.statisticFactory);
router.get("/statistic-agency", adminCtrl.statisticAgency);
router.get("/statistic-guarantee", adminCtrl.statisticGuarantee);

module.exports = router;
