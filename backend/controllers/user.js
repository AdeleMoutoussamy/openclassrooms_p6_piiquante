// package cryptage pour les mots de passe
const bcrypt = require('bcrypt');
// package qui permet de créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

const User = require("../models/user");

// J'exporte une fonction pour l'enregistrement d'un utilisateur
exports.signup = (req, res, next) =>
{
    // Méthode hash permattant d'enregistrer de manière sécurisée dans la base de données les mots de passe des utilisateurs
    bcrypt.hash(req.body.password, 10)
    .then(hash =>
    {
        const user = new User
        ({
            email: req.body.email,
            password: hash
        });
        // Enregistre l'objet dans la base de données
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error =>
    { 
        console.log(error)
        return res.status(500).json({ error })
    });
};

// J'exporte une fonction pour connecter des utilisateurs existants
exports.login = (req, res, next) =>
{
    // findOne pour trouver l'email unique
    User.findOne({ email: req.body.email })
    .then(user =>
    {
        if (!user)
        {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Méthode compare vérifie si un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données
        bcrypt.compare(req.body.password, user.password)
        .then(valid =>
        {
            if (!valid)
            {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                { userId: user._id },
                // Clé secrète pour l'encodage
                process.env.SECRETTOKEN,
                { expiresIn: '24h' })
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};