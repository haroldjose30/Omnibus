const express = require('express');
const mongoose = require('mongoose');
//const cors = require('cors');
const http = require('http');

const routes = require('./rotes');
const { setupWebsocket } = require('./websocket');
var Secrets = require('./secrets_real')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

console.log("Secrets.MONGO_DB_CONNECTION_KEY",Secrets.MONGO_DB_CONNECTION_KEY);
console.log("Secrets.FIXED_ACCESS_TOKEN",Secrets.FIXED_ACCESS_TOKEN);


mongoose.connect(Secrets.MONGO_DB_CONNECTION_KEY,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
})

//app.use(cors);

//define que o express irá entender o padrao JSON
app.use(express.json());

//aplica a definicao das rotas do arquivo separdo
app.use(routes);

server.listen(3333);