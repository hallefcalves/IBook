const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth.json')

const Usuario = require('../models/usuario.js');
const EnderecoUsuario = require('../models/endereco/enderecoUsuario.js');

//Podemos usar o Router para definir as rotas para o usuário
const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret);
}

router.get('/:usuarioId', async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.usuarioId).populate('enderecoUsuario').select('+senha');
        return res.status(200).send({ usuario });
    }
    catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.post('/auth', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({email}).select('+senha');

    if(!usuario)
        return res.status(400).send({ error: 'User not found'});

    if(!await bcrypt.compare(senha, usuario.senha))
        return res.status(400).send({ error: 'Invalid password'});

    usuario.senha = undefined;

    res.send({ 
        token: generateToken({ id: usuario.id }),
        userid: usuario.id, 
    });
});


router.post('/registrar', async (req, res) => {
    
    try{
        const { nome, dataDeAniversario, enderecoUsuario, telefone1, telefone2, email, senha } = req.body;

        if(await Usuario.findOne({ email })){
            return res.status(400).send({error: 'User already exists'});
        }
        const usuario = await Usuario.create({nome, dataDeAniversario,telefone1,telefone2,email,senha});
        if(enderecoUsuario != null){
            await Promise.all(enderecoUsuario.map(async end =>{
            const enduser = new EnderecoUsuario({...end, usuario: usuario._id});
            await enduser.save();
            usuario.enderecoUsuario.push(enduser);
            }));
        }
        await usuario.save();

        return res.status(200).send({
            usuario,
            token: generateToken({ id: usuario.id }), 
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/atualizar/:usuarioId', async (req, res) => {
    try{
        const { nome, dataDeAniversario, enderecoUsuario, telefone1, telefone2 } = req.body;
        console.log(req.params.usuarioId);
        const usuario = await Usuario.findByIdAndUpdate(req.params.usuarioId, { 
            nome,
            dataDeAniversario,
            telefone1,
            telefone2,
         });
        
        if(usuario.enderecoUsuario != null){
            usuario.enderecoUsuario = [];
        }

        await EnderecoUsuario.deleteMany({ usuario: usuario._id});
        

        if(enderecoUsuario != null){
            await EnderecoUsuario.deleteMany({ usuario: usuario._id});
        }
        await Promise.all(enderecoUsuario.map(async end =>{
            const enduser = new EnderecoUsuario({...end, usuario: usuario._id});
            await enduser.save();
            usuario.enderecoUsuario.push(enduser);
        }));
        console.log('Bateu');
        await usuario.save();
        console.log('Bateu');
        return res.send({
            token: generateToken({ id: usuario.id }), 
        });
    }
    catch (err) {
        console.log(err);
}});

router.delete('/apagar/:usuarioId', async (req, res) => {
    try{
       
       await Usuario.findByIdAndRemove(req.params.usuarioId).populate('enderecoUsuario')
       await EnderecoUsuario.findOneAndRemove({usuario: req.params.usuarioId});
       return res.send({log: 'Deleted Succesfully'})

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting user' });
    }
});

module.exports = app => app.use('/usuario', router);
