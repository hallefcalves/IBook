const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth.json')

const Usuario = require('../models/usuario');
const EnderecoUsuario = require('../models/endereco/enderecoUsuario');

//Podemos usar o Router para definir as rotas para o usuário
const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret);
}

router.put('/atualizar')

router.post('/registrar', async (req, res) => {
    const { nome, dataDeAniversario, enderecoUsuario, telefone1, telefone2, email, senha } = req.body;
    try{
    /*
        if(await Usuario.findOne({ email })){
            return res.status(400).send({error: 'User already exists'});
        }
        */    
        const usuario = await Usuario.create({nome, dataDeAniversario, telefone1, telefone2, email, senha});
        await Promise.resolve(async enderecoUsuarios => {
            const end = new EnderecoUsuario({ ...enderecoUsuarios, usuario: usuario._id});
            await end.save();
            usuario.enderecoUsuario.push(end);
        });

        return res.send({ 
            Usuario,
            token: generateToken({ id: usuario.id }), 
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.post('/auth', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({email}).select('+password');

    if(!usuario)
        return res.status(400).send({ error: 'User not found'});

    if(!await bcrypt.compare(senha, usuario.senha))
        return res.status(400).send({ error: 'Invalid password'});
    
    usuario.senha = undefined;

    res.send({ 
        usuario, 
        token: generateToken({ id: usuario.id }) 
    });
});

module.exports = app => app.use('/usuario', router);