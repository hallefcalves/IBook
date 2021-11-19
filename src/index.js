/* Método do Express antigo
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
*/

//Método do Express novo
const cors = require('cors');
const dotenv = require('dotenv')
const Path = require('path');
const express = require("express");

dotenv.config({path: Path.join(__dirname, '../config/.env')})

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

require('./controllers/usuariosController')(app);
require('./controllers/bibliotecaController')(app);
require('./controllers/entregadorController')(app);
require('./controllers/livroController')(app);
require('./controllers/requisicoesController')(app);

app.listen(process.env.PORT || 3000)