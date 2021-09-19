const mongoose = require('../../database');

const enderecoBibliotecaSchema = new mongoose.Schema({
    rua: {
        type: String,
        require: true,
    },
    num:{
        type: String,
        require: true,
    },
    bairro:{
        type: String,
        require: true,
    },
    complemento:{
        type: String,
        require: true,
    },
    cidade:{
        type: String,
        require: true,
    },
    estado:{
        type: String,
        require: true,
    },
    cep:{
        type: String,
        require: true,
    },
    biblioteca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Biblioteca',
        require: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

const EnderecoBiblioteca = mongoose.model('EnderecoBiblioteca', enderecoBibliotecaSchema);

module.exports = EnderecoBiblioteca;