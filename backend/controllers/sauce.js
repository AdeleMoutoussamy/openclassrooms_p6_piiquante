const Sauce = require('../models/sauce');
// Le package fs expose des méthodes pour interagir avec le système de fichiers du serveur
const fs = require('fs');

// Fonction pour renvoyer un tableau contenant tous les sauces dans la base de données
exports.getAllSauces = (req, res, next) =>
{
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction pour trouver la sauce unique ayant le même _id que le paramètre de la requête
exports.getOneSauce = (req, res, next) =>
{
    Sauce.findOne({ _id: req.params.id }) // Objet de comparaison
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) =>
{
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce(
        {
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

    // updateOne -> modifier/mettre à jour une sauce dans la base de donnée.
    Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
    .then(res.status(200).json({ message : " Sauce modifiée ! "}))
    .catch(error => res.status(400).json({ error }));
}

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) =>
{
    Sauce.findOne({ _id : req.params.id })
    .then(sauce =>
    {
        // Je récupére le nom de fichier
        const filename = sauce.imageUrl.split("/images/")[1];
        // unlink permet de supprimer un fichier du système de fichiers
        fs.unlink(`images/${filename}`, () =>
        {
            Sauce.deleteOne({_id : req.params.id})
            .then(res.status(200).json({ message: " Sauce supprimée ! " }))
            .catch(error => res.status(400).json({ error }))
  
        })
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
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }));
        break;

        // Quand un utilisateur a déjà liké ou disliké une sauce
        case 0 :
        Sauce.findOne({ _id: sauceId })
        .then((sauce) =>
        {
            if (sauce.usersLiked.includes(userId))
            { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
               .then(() => res.status(200).json({ message: `Neutre` }))
               .catch((error) => res.status(400).json({ error }));
            }

            if (sauce.usersDisliked.includes(userId))
            { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(404).json({ error }));
        break;

        // Disliker une sauce
        case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
        .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
        .catch((error) => res.status(400).json({ error }));
        break;

        default:
        console.log(error);
    }
}