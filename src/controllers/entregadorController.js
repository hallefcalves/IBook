const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth.json')

const Entregador = require('../models/entregador.js');
const EnderecoEntregador = require('../models/endereco/enderecoEntregador.js');

//Podemos usar o Router para definir as rotas para o entregador
const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret);
}

router.get('/:entregadorId', async (req, res)=>{
    try{
        const entregador = await Entregador.findById(req.params.entregadorId).populate('enderecoEntregador').select('+senha');

        return res.send({ entregador })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.post('/auth', async (req, res) => {
    const { email, senha } = req.body;

    const entregador = await Entregador.findOne({email}).select('+password');

    if(!entregador)
        return res.status(400).send({ error: 'User not found'});

    if(!await bcrypt.compare(senha, entregador.senha))
        return res.status(400).send({ error: 'Invalid password'});

    entregador.senha = undefined;

    res.send({ 
        token: generateToken({ id: entregador.id }),
        entregadorid: entregador.id
    });
});


router.post('/registrar', async (req, res) => {
    
    try{
        const { nome, dataDeAniversario, enderecoEntregador, meioDeTransporte, telefone1, telefone2, email, senha } = req.body;

        if(await Entregador.findOne({ email })){
            return res.status(400).send({error: 'User already exists'});
        }
    
       const entregador = await Entregador.create({nome, dataDeAniversario,meioDeTransporte, telefone1,telefone2,email,senha});
       
       if(enderecoEntregador != null){
            await Promise.all(enderecoEntregador.map(async end =>{
                const endentre = new EnderecoEntregador({...end, entregador: entregador._id});
                await endentre.save();
                entregador.enderecoEntregador.push(endentre);
            }));
        };
        
        await entregador.save();

        return res.send({
            _id: entregador.id,
            token: generateToken({ id: entregador.id }), 
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/atualizar/:entregadorId', async (req, res) => {
    try{
        const { nome, dataDeAniversario, enderecoEntregador, meioDeTransporte, telefone1, telefone2, email, senha } = req.body;

        const entregador = await Entregador.findByIdAndUpdate(req.params.entregadorId, { 
            nome,
            dataDeAniversario,
            meioDeTransporte,
            telefone1,
            telefone2,
         });
        
         entregador.enderecoEntregador = [];

        await EnderecoEntregador.deleteMany({ entregador: entregador._id});
        

        await Promise.all(enderecoEntregador.map(async end =>{
            const endentre = new EnderecoEntregador({...end, entregador: entregador._id});
            await endentre.save();
            entregador.enderecoEntregador.push(endentre);
        }));

        await entregador.save();

        return res.send({

            token: generateToken({ id: entregador.id }), 
        });
    }
    catch (err) {
        console.log(err);
}});

router.delete('/apagar/:entregadorId', async (req, res) => {
    try{
       
       await Entregador.findByIdAndRemove(req.params.entregadorId).populate('enderecoEntregador')
       await EnderecoEntregador.findOneAndRemove({entregador: req.params.entregadorId});
       return res.send({log: 'Deleted Succesfully'})

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting user' });
    }
});

module.exports = app => app.use('/entregador', router);