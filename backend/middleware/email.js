const emailSchema = require('validator');

const emailSchema = (req, res, next) =>
{
    if (!emailSchema.isEmail(req.body.email))
    {
        req.invalidEmail = 1;
    }
    next();
}