const express = require("express");
const router = express.Router();
const productCtrl = require("../app/controllers/productCtrl");


router.post("/productline-create", productCtrl.createProductline);
router.get("/productlines", productCtrl.getAllProductLines);
router.get("/",productCtrl.getAllProducts);

module.exports = router;
