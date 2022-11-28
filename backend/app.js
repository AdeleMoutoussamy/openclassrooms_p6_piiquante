// J'importe Express
// qui facilite la création et la gestion des serveurs Node
const express = require('express');
// J'importe Mongoose
// facilite les interactions entre notre application Express et notre base de données MongoDB
const mongoose = require('mongoose');
// J'importe Path
// accéder au chemin de notre serveur
const path = require('path');
// J'importe Helmet
// aide à sécuriser nos applications Express en définissant divers en-têtes HTTP
const helmet = require('helmet');
// J'importe Express Mongo Sanitize
// remplace les caractères interdits dans la base par un autre caractère autorisé
const expressMongoSanitize = require('express-mongo-sanitize');
// dotenv charge les variables d'environnement dans un fichier .env
require('dotenv').config();

// J'importe les routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// J'appelle la méthode express() pour créer une application Express
const app = express();

// Pour se connecté à MongoDB
mongoose.connect(process.env.DBLINK,
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

// Je crée les headers qui va permettre à notre application d'accéder à l'API
app.use((req, res, next) =>
{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(
  expressMongoSanitize({
    replaceWith: "_",
  })
);

// Pour avoir accés au corps de la requête
app.use(express.json());

// Express gére la ressource images de manière statique 
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route qui permet de récupéré les utilisateurs qui se créent un compte sur le site
app.use('/api/auth', userRoutes);
// Route qui permet de récupéré les sauces que les utilisateurs créent sur le site
app.use('/api/sauces', sauceRoutes);

app.use(helmet());

// J'exporte notre app pour qu'on puisse y accéder depuis les autres fichiers de notre projet, notamment de notre serveur Node
module.exports = app;