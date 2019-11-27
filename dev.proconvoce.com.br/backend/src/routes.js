const express = require('express')

const CombustivelController = require('./controllers/CombustivelController')
const GasController = require('./controllers/GasController')
const OvoController = require('./controllers/OvoController')
const CestaController = require('./controllers/CestaController')

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.send('Hello world')
})

routes.get('/comb', CombustivelController.index);
routes.get('/gas', GasController.index);
routes.get('/ovo', OvoController.index);
routes.get('/cesta', CestaController.index);

module.exports = routes;