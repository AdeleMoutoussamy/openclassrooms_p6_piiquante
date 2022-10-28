const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is()
.min(6)                                    
.is()
.max(20)                                  
.has()
.uppercase()                              
.has()
.lowercase()                             
.has()
.digits(2)                                
.has()
.not()
.spaces()                    

module.exports = passwordSchema;