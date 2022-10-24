// require est la commande pour importer le package
const http = require('http');
// J'importe app.js
const app = require('./app');

// La fonction normalizePort renvoie un port valide
const normalizePort = val =>
{
  const port = parseInt(val, 10);

    if (isNaN(port))
    {
      return val;
    }
    if (port >= 0)
    {
      return port;
    }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
// Sur quelle port app va tourner
app.set('port', port);

// La fonction errorHandler recherche les différentes erreurs et les gères de manière appropriée
const errorHandler = error =>
{
    if (error.syscall !== 'listen')
    {
        throw error;
    }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code)
  {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// La fonction app sera appelé à chaque requête reçu par le serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () =>
{
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// Le serveur écoute les requêtes
server.listen(port);