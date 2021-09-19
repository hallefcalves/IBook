const mongoose = require('../../database');

const enderecoUsuarioSchema = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

const EnderecoUsuario = mongoose.model('EnderecoUsuario', enderecoUsuarioSchema);

module.exports = EnderecoUsuario;