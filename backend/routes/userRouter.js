const express = require('express');
const router = express.Router();
const middlewareCtrl = require('../app/controllers/middlewareCtrl');
const userCtrl = require('../app/controllers/userCtrl');

router.get('/', userCtrl.getAllUsers);
router.post('/login', userCtrl.login);
router.post('/create', userCtrl.create);
router.delete('/delete/:id', userCtrl.delete);
router.put('/update/:id', userCtrl.update);

module.exports = router;