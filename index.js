// index.js
const express = require('express');
const routes = require('./routes/routes');
const { informeMiddleware } = require('./services/middleware');

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware de informe
app.use(informeMiddleware);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

