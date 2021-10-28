const mongoose = require('../database');

const livroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        require: true,
    },
    genero:{
        type: String,
        require: true,
    },
    descricao:{
        type: String,
        require: true,
    },
    biblioteca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Biblioteca',
        require: true,
    },
    emprestado:{
        type: Boolean,
        default: false
    },
    reservado:{
        type: Boolean,
        default: false
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },

});

const Livro = mongoose.model('Livro', livroSchema);

module.exports = Livro;