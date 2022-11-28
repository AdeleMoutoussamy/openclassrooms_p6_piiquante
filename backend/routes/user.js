const express = require('express');
// Méthode pour créer des routers
const router = express.Router();
// J'importe Express Rate Limit
// pour se protéger des forces brute
const rateLimit = require('express-rate-limit');

// J'importe mon fichier user du dossier controllers, et mes fichiers email et password du dossier middleware
const userCtrl = require('../controllers/user');
const verifyEmail = require('../middleware/email');
const verifyPassword = require('../middleware/password');

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 3,
    message: " Trop de requête abusive, vous devez attendre 3 minutes."
})

// Routers qui contiennent toutes les informations pour le nouveau user qui va être ajouté à la base
router.post('/signup', verifyEmail, verifyPassword, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

// J'exporte les routers
module.exports = router;