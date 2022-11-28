// J'importe Validator
// pour valider les schémas d'email
const emailSchema = require('validator');

module.exports = (req, res, next) =>
{
    // Si ce n'est pas un email
    if (!emailSchema.isEmail(req.body.email))
    {
        req.invalidEmail = 1;
    }
    next();
}