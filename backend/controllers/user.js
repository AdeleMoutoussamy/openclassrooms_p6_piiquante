// J'importe Bcrypt
// aide à hacher les mots de passe
const bcrypt = require('bcrypt');
// J'importe JsonWebToken
// permet de créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// J'importe mon Schéma pour l'user
const User = require('../models/user');

// J'exporte une fonction pour l'enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) =>
{
    // Méthode hash permattant d'enregistrer de manière sécurisée dans la base de données les mots de passe des utilisateurs
    bcrypt.hash(req.body.password, 10)
    .then(hash =>
    {
        // Si invaidEmail existe et qu'il est égal à un 1
        if (req.invalidEmail && req.invalidEmail == 1)
        {
            const error = { message: " Veuillez rentrer un email valide ! ex: jean@gmail.com " };
            res.status(401).json(error);

          // Si badPassword existe et qu'il est égal à un 1
        } else if (req.badPassword && req.badPassword == 1)
        {
            const error = { message: " Le mot de passe doit faire au minimum 6 caractères et maximum 20 caractères, avec au moins une majuscule, une minuscule et deux chiffres maximum " };
            res.status(401).json(error);

          // Sinon je créée un objet pour le nouvel utilisateur avec l'email et le mot de passe hashé
        } else {
            const user = new User
            ({
                email: req.body.email,
                password: hash
            });

            // Enregistre l'objet dans la base de données
            user.save()
            // Et retourne une promesse
            .then(() => res.status(201).json({ message: " Utilisateur créé ! " }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error =>
    { 
        console.log(error)
        return res.status(500).json({ error });
    });
};

// J'exporte une fonction pour connecter des utilisateurs existants
exports.login = (req, res, next) =>
{
    // findOne pour trouver l'email unique
    User.findOne({ email: req.body.email })
    .then(user =>
    {
        // Si il n'y a pas l'utilisateur
        if (!user)
        {
            return res.status(401).json({ error: " Utilisateur non trouvé ! " });
        }
        // Méthode compare vérifie si un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données
        bcrypt.compare(req.body.password, user.password)
        .then(valid =>
        {
            // Si le mot de passe est incorrect
            if (!valid)
            {
                return res.status(401).json({ error: " Mot de passe incorrect ! " });
            }
            res.status(200).json
            ({
                userId: user._id,
                // Les tokens d'authentification permettent aux utilisateurs de se connecter une seule fois à leur compte
                // sign pour chiffrer un nouveau token
                token: jwt.sign
                (
                    { userId: user._id },
                    // Clé secrète pour l'encodage
                    process.env.SECRETTOKEN,
                    // Définir la durée de validité du token à 24 heures
                    // L'utilisateur devra donc se reconnecter au bout de 24 heures
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};