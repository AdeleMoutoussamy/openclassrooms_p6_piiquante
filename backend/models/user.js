// J'importe mongoose
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schéma de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Je l'applique au schéma
userSchema.plugin(uniqueValidator);

// J'exporte le modèle terminé
module.exports = mongoose.model("User", userSchema);