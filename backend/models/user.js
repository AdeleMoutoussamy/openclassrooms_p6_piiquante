// J'importe mongoose
const mongoose = require('mongoose');
// Permet de ne pas avoir plusieurs comptes avec le même email
const uniqueValidator = require('mongoose-unique-validator');

// Schéma de données
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Je l'applique au schéma
userSchema.plugin(uniqueValidator);

// J'exporte le modèle terminé
module.exports = mongoose.model('User', userSchema);