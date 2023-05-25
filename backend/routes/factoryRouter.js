const express = require("express");
const router = express.Router();
const factoryCtrl = require("../app/controllers/factoryCtrl");

router.get("/statistic-error/:id", factoryCtrl.statisticError); // id of factory
router.get("/statistic-year/:id", factoryCtrl.statisticYear); // id of factory
router.get("/error-product/:id", factoryCtrl.getAllErrorProduct); // id of factory
router.post("/import-new-product/:id", factoryCtrl.importNewProduct);
router.post("/import-product", factoryCtrl.importProduct); 
router.post("/export-product", factoryCtrl.exportProduct);
router.get("/storage/:id", factoryCtrl.getStorage); // id of factory
router.get("/:id", factoryCtrl.getFactoryById); // id of factory
router.get("/", factoryCtrl.getAllFactories);

module.exports = router;
