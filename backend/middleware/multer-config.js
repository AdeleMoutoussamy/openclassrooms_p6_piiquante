// J'importe Multer
// permet de télécharger les images sur le serveur
const multer = require('multer');

// Dictionnaire qui indique le format d'un document
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
};

// Objet de configuration pour multer
// diskStorage configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage
({
    // Permet d'expliquer à multer dans quel dossier enregistré les fichiers
    destination: (req, file, callback) =>
    {
        callback(null, 'images');
    },
    // Explique à multer quel nom de fichier à utiliser
    filename: (req, file, callback) =>
    {
        const name = file.originalname.split(' ').join('_');
        // Pour résoudre l'extension de fichier appropriée
        const extension = MIME_TYPES[file.mimetype];
        // Date.now pour le rendre le plus unique possible
        callback(null, name + Date.now() + '.' + extension);
    }
});

// J'exporte multer, je lui passe la const storage et lui indique qu'on gére uniquement (single) les téléchargements de fichiers image
module.exports = multer({storage}).single('image');