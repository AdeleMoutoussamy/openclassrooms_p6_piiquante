const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
};

// Objet de configuration pour multer
const storage = multer.diskStorage
({
    // Permet d'expliquer à multer dans quel dossier enregistrer les fichiers
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
        callback(null, name + Date.now() + '.' + extension);
    }
});

// J'exporte multer, je lui passe la const storage et lui indique qu'on gére uniquement les téléchargements de fichiers image
module.exports = multer({storage}).single('image');