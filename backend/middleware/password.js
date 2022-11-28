// J'importe mon Schéma du password
const passwordSchema = require('../models/password');

module.exports = (req, res, next) =>
{
    // Si le password ne coresspond pas au Schéma
    if (!passwordSchema.validate(req.body.password))
    {
        req.badPassword = 1 ;
    } 
    next();
};