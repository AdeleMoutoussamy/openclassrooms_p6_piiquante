const jwt = require('jsonwebtoken');

require('dotenv').config();

// Vérifier les informations d'authentification envoyé par le client
module.exports = (req, res, next) =>
{
   try {
      // Je récupère le token
      const token = req.headers.authorization.split(' ')[1];
      // Je le décode avec verify
      const decodedToken = jwt.verify(token, process.env.SECRETTOKEN);
      const userId = decodedToken.userId;
      req.auth = {
         userId: userId
      };
	   next();
    
   } catch(error) {
      res.status(401).json({ error });
   }
};