// J'importe express
const express = require("express");
// J'importe mongoose
const mongoose = require("mongoose");
require('dotenv').config();
// J'importe le router
const userRoutes = require('./routes/user');

// J'appel la méthode express pour créer une application
const app = express();

mongoose.connect(process.env.DBLINK,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Rajout des headers pour sécuriser l'utilisation de l'API
app.use((req, res, next) =>
{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// middleware qui intercépte toutes les requêtes qui contiennent du json
app.use(express.json());

app.use('/api/auth', userRoutes);

// J'exporte app
module.exports = app;