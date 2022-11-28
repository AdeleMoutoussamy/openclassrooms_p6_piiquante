// J'utilise Mongoose pour créer un modèle de données afin de faciliter les opérations de la base de données
const mongoose = require('mongoose');
//J'importe Unique Validator
// permet de ne pas avoir plusieurs utilisateurs avec le même email
const uniqueValidator = require('mongoose-unique-validator');
// J'importe Mongoose Errors
// me remonte les erreurs de mongoose
const mongooseErrors = require('mongoose-errors');

const userSchema = mongoose.Schema
({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Je l'applique au schéma avant d'en faire un modèle
userSchema.plugin(uniqueValidator);
// pour me renvoyé les erreurs
userSchema.plugin(mongooseErrors);

// J'exporte le modèle terminé
module.exports = mongoose.model('User', userSchema);