// middleware.js
const informeMiddleware = (req, res, next) => {
    console.log(`Informe: Se realizó una consulta a la ruta ${req.originalUrl}`);
    next();
  };
  
  module.exports = { informeMiddleware };
  