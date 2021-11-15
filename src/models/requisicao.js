const mongoose = require('../database');

const requisicaoSchema = new mongoose.Schema({
    biblioteca: {
        type: mongoose.types.ObjectId,
        require: true,
    },
    usuario: {
        type: mongoose.types.ObjectId,
        require: true,
    },
    livro: {
        type: mongoose.types.ObjectId,
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