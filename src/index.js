/* Método do Express antigo

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
*/

//Método do Express novo

const express = require("express");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

require('./controllers/authController')(app);

app.listen(3000);
