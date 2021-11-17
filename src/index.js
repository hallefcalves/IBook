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
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.options('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

require('./controllers/usuariosController')(app);
require('./controllers/bibliotecaController')(app);
require('./controllers/entregadorController')(app);

app.listen(process.env.PORT || 3000)
