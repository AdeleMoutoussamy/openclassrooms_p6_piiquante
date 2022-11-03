// J'importe express
const express = require('express');

// Je créer un router
const router = express.Router();

const rateLimit = require('express-rate-limit');

const userCtrl = require('../controllers/user');
const verifyEmail = require('../middleware/email');
const verifyPassword = require('../middleware/password');

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 3,
    message: " Trop de requête abusive, vous devez attendre 3 minutes."
})

router.post('/signup', verifyEmail, verifyPassword, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

// J'exporte le router
module.exports = router;