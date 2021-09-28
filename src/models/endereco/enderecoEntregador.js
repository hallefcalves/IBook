const mongoose = require('../../database');

const enderecoEntregadorSchema = new mongoose.Schema({
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
    entregador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entregador',
        require: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

const EnderecoEntregador = mongoose.model('EnderecoEntregador', enderecoEntregadorSchema);

module.exports = EnderecoEntregador;