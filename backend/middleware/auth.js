const jwt = require('jsonwebtoken');

require('dotenv').config();

// Je vérifie les informations d'authentification envoyé par le client
module.exports = (req, res, next) =>
{
   try
   {
      // J'extrais le token du header Authorization de la requête
      const token = req.headers.authorization.split(' ')[1];
      // Verify pour décoder notre token
      const decodedToken = jwt.verify(token, process.env.SECRETTOKEN);
      // J'extrais l'id de l'utilisateur de notre token et le rajoute à l’objet request afin que mes différentes routes puissent l’exploité
      const userId = decodedToken.userId;
      req.auth = {
         userId: userId
      };
	   next();
    
   } catch(error) {
      res.status(401).json({ error });
   }
};