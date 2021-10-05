const dotenv = require('dotenv')
//Cria conexão com o banco de dados MongoDB
const mongoose = require('mongoose');
const Path = require('path');
const caminho = Path.join(__dirname, '../config/.env')
dotenv.config({path: Path.join(__dirname, '../config/.env')})

mongoose.connect(process.env.CONNECTIONSTRING||"");
mongoose.Promise = global.Promise;

//Prepara o module.exports para envio dos dados ao MongoDB
module.exports = mongoose;