const mongoose = require('../database');

const requisicaoSchema = new mongoose.Schema({
    biblioteca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Biblioteca',
        require: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    },
    livro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro',
        require: true,
    },
    dataRequisicao: {
        type: Date,
        require: true,
        default: Date.now,
    },
    dataDevolucao: {
        type: Date,
        require: true,
        default: Date.now+14,
    },
    status: {
        type: String,
        require: true,
        default: 'Pendente',
    },
});

const Requisicao = mongoose.model('Requisicao', requisicaoSchema);

module.exports = Requisicao;