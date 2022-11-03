// J'importe Express
const express = require('express');
// J'importe Mongoose
const mongoose = require('mongoose');
// Accéder au path de notre serveur
const path = require('path');
// J'importe Helmet
const helmet = require('helmet');
// J'importe Express Mongo Sanitize
const expressMongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

// J'importe les router
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// J'appelle la méthode express() pour créer une application Express.
const app = express();

// Pour se connecté à MongoDB.
mongoose.connect(process.env.DBLINK,
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(helmet());

// Ceci va permettre à notre application d'accéder l'API sans problème.
app.use((req, res, next) =>
{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(
  expressMongoSanitize({
    replaceWith: "_",
  })
);

app.use(express.json());

// Express gére la ressource images de manière statique 
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// J'exporte app
module.exports = app;