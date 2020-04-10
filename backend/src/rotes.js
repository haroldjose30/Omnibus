const { Router } = require('express');
const routes = Router()
const Secrets = require('./secrets_real');

const BusLineLocationController = require('./controllers/BusLineLocationController')


//index, show, store,update,destroy
routes.get('/BusLineLocation',verifyToken,BusLineLocationController.index);
routes.post('/BusLineLocation',verifyToken,BusLineLocationController.store);



function verifyToken(req, res, next){
    var token = req.headers['x-access-token'];
    if (!token)  {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    
   
    if (token != Secrets.FIXED_ACCESS_TOKEN)  {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    
    next();
  }



module.exports = routes;