//Cria conexão com o banco de dados MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ibook:qRc9RGtcWEuuwkgA@ibook-cluster.ywy6w.mongodb.net/ibook?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

//Prepara o module.exports para envio dos dados ao MongoDB
module.exports = mongoose;