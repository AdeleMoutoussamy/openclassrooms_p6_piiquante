// J'importe Password Validator
// pour valider les mots de passe
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(6)                                    
.is().max(20)                                  
.has().uppercase(1)                              
.has().lowercase(1)                             
.has().digits(2)                                
.has().not().spaces()                    

module.exports = passwordSchema;