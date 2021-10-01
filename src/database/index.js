//Cria conexão com o banco de dados MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ibook-db');
mongoose.Promise = global.Promise;

//Prepara o module.exports para envio dos dados ao MongoDB
module.exports = mongoose;