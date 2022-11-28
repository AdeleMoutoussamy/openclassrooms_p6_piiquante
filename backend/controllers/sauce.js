// J'importe mon Schéma pour la sauce
const Sauce = require('../models/sauce');
// J'importe fs ("File System")
// permet de créer et gérer des fichiers pour y stocker ou lire des fichiers dans un programme Node
const fs = require('fs');

// Fonction pour renvoyer un tableau contenant tous les sauces dans la base de données
exports.getAllSauces = (req, res, next) =>
{
    // find nous retourne toutes les sauce
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction pour trouver la sauce unique ayant le même id que le paramètre de la requête
exports.getOneSauce = (req, res, next) =>
{
    // findOne nous retourne une seule sauce
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) =>
{
    // Je parse l'objet
    const sauceObject = JSON.parse(req.body.sauce)
    // Je crée l'objet
    const sauce = new Sauce(
        {
            // Spread opérator est utilisé pour faire une copie de tous les éléments de sauceObject
            ...sauceObject,
            // Je génére l'URL
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [' '],
            usersdisLiked: [' '],
        });
        sauce.save()
        .then(() => res.status(201).json({ message: " Sauce enregistrée ! " }))
        .catch((error) => res.status(400).json({ error })
    );
};

// Fonction pour modifier une sauce
exports.updateSauce = (req, res, next) =>
{
    // ? Je regarde si il y a un champ file
    const sauceObject = req.file ? {
    // Je récupère l'objet en le parsant
    ...JSON.parse(req.body.sauce),
    // Je recrée l'URL de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // Sinon je récupère l'objet directement dans le corps de la requête
    } : { ...req.body };

    Sauce.findOne({ _id: req.params.id })
    .then((sauce) =>
    {
        // Si l'id du user qui doit modifié la sauce est différent de l'id du user d'authentification
        if (sauce.userId != req.auth.userId)
        {
            res.status(401).json({ message: "Not authorized" });

          // Sinon, s'ils ne sont pas différent
        } else {

            // updateOne -> modifier/mettre à jour une sauce dans la base de donnée.
            Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
            )
            .then(res.status(200).json({ message: " Sauce modifiée ! " }))
            .catch((error) => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
}

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) =>
{
    Sauce.findOne({ _id : req.params.id })
    .then(sauce =>
    {
        // Si l'id du user qui doit supprimé la sauce est différent de l'id du user d'authentification
        if (sauce.userId != req.auth.userId)
        {
            res.status(401).json({ message: "Not authorized" });

          // Sinon, s'ils ne sont pas différent
        } else {

            // Je récupére le nom de fichier
            const filename = sauce.imageUrl.split("/images/")[1];
            // unlink permet de supprimer un fichier du système de fichiers
            fs.unlink(`images/${filename}`, () =>
            {
                Sauce.deleteOne({_id : req.params.id})
                .then(res.status(200).json({ message: " Sauce supprimée ! " }))
                .catch(error => res.status(400).json({ error }))
            })}
    })
    .catch(error => res.status(500).json({ error }));
}

// Fonction pour like et dislike une sauce
exports.likeDislikeSauce = (req, res, next) =>
{
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id

    switch (like)
    {
        // Liker une sauce
        case 1 :
        // Je récupére la sauce, avec l'id de la sauce. Je push l'utilisateur qui a liké et j'incrémente le like de +1.
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }));
        break;

        // Quand un utilisateur a déjà liké ou disliké une sauce
        // Quand le front envoie un zéro, ça veux dire que l'utilisateur avait déjà liké ou disliké et qu'il annule sont vote
        case 0 :
        // Je récupére la sauce, avec l'id de la sauce.
        Sauce.findOne({ _id: sauceId })
        .then((sauce) =>
        {
            // Si un utlisateur a déjà liké
            if (sauce.usersLiked.includes(userId))
            {
                // Je récupére la sauce, avec l'id de la sauce. Je pull l'utilisateur qui a liké et je décrémente le like de -1.
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
               .then(() => res.status(200).json({ message: `Neutre` }))
               .catch((error) => res.status(400).json({ error }));
            }

            // Si un utilisateur a déjà disliké
            if (sauce.usersDisliked.includes(userId))
            {
                // Je récupére la sauce, avec l'id de la sauce. Je pull l'utilisateur qui a disliké et je décrémente le like de -1.
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(404).json({ error }));
        break;

        // Disliker une sauce
        case -1 :
        // Je récupére la sauce, avec l'id de la sauce. Je push l'utilisateur qui a disliké et j'incrémente le dislike de +1.
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
        .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
        .catch((error) => res.status(400).json({ error }));
        break;

        default:
        console.log(error);
    }
}