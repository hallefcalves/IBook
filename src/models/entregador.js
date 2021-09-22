const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const entregadorSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    enderecoEntregador: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnderecoUsuario',
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
    meioDeTransporte: {
        type: String,
        require: true,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    bonus: {
        type: Number,
        default: 0
    },
    extensao: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true,
        //select: false,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

entregadorSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    next();
});

const Entregador = mongoose.model('Entregador', entregadorSchema);

module.exports = Entregador;