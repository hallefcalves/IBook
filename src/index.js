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

app.use(cors());

app.options('*', cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

require('./controllers/usuariosController')(app);
require('./controllers/bibliotecaController')(app);
require('./controllers/entregadorController')(app);
require('./controllers/livrosController')(app);
require('./controllers/requisicoesController')(app);

app.listen(process.env.PORT || 3000)