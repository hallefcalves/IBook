const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const bibliotecaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    nomeResponsavel:{
        type: String,
        required: true,
    },    
    enderecoBiblioteca: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnderecoBiblioteca',
        require: true,
    }],
    telefone1:{
        type: String,
        require: true,
    },
    telefone2:{
        type: String,
        require: false,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    emailResponsavel: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    livrosDevolu:{
        type: Number,
        default: 0
    },
    livrosDisp:{
        type: Number,
        default: 0
    },
    livrosRepo:{
        type: Number,
        default: 0
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Biblioteca = mongoose.model('Biblioteca', bibliotecaSchema);

module.exports = Biblioteca;