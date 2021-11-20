const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        //require: true,
    },
    dataDeAniversario: {
        type: Date,
        //require: true,
    },
    enderecoUsuario: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnderecoUsuario',
        //require: true,
    }],
    telefone1:{
        type: String,
        //require: true,
    },
    telefone2:{
        type: String,
        //require: false,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    pontualidadeDevolucao: {
        type: Number,
        default: 0,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    livroAtual: {
        type: String,
    },
    proximaDevolu: {
        type: Date
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    }],
    senha: {
        type: String,
        required: true,
        select: false,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

usuarioSchema.pre('save', async function(next) {
    if(this.senha != undefined) {
        const hash = await bcrypt.hash(this.senha, 10);
        this.senha = hash;
    }
    next();
    
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
