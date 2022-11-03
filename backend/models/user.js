// J'importe mongoose
const mongoose = require('mongoose');
// Permet de ne pas avoir plusieurs utilisateurs avec le même email.
const uniqueValidator = require('mongoose-unique-validator');

const mongooseErrors = require('mongoose-errors');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Je l'applique au schéma vant d'en faire un modèle.
userSchema.plugin(uniqueValidator);

userSchema.plugin(mongooseErrors);

// J'exporte le modèle terminé
module.exports = mongoose.model('User', userSchema);