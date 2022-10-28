const passwordSchema = require('../models/password');

module.exports = (req, res, next) =>
{
    if (!passwordSchema.validate(req.body.password))
    {
        req.badPassword = 1 ;
    } 
    next();
};