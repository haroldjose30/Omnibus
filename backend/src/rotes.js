const { Router } = require('express');
const routes = Router()

const BusLineLocationController = require('./controllers/BusLineLocationController')


//index, show, store,update,destroy
routes.get('/BusLineLocation',BusLineLocationController.index);
routes.post('/BusLineLocation',BusLineLocationController.store);
module.exports = routes;


//Query Params: request.query (Filtros, ordenacao, paginacao)
//Route Params: request.params (identificar um recurso na alteracao ou delecao)
//Body: 

