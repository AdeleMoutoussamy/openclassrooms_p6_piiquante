// J'importe express
const express = require('express');
// Je créer un router
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// J'exporte le router
module.exports = router;