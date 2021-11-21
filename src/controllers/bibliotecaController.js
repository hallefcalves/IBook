const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth.json')

const Biblioteca = require('../models/biblioteca.js');

const EnderecoBiblioteca = require('../models/endereco/enderecoBiblioteca.js');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret);
}

router.get('/', async(req, res) => {
    try{
        const bibliotecas = await Biblioteca.find().populate('enderecoBiblioteca')

        return res.send({ bibliotecas })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.get('/:bibliotecaId', async (req, res)=>{
    try{
        const biblioteca = await Biblioteca.findById(req.params.bibliotecaId).populate('enderecoBiblioteca').select('+senha');

        return res.send({ biblioteca })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.post('/auth', async (req, res) => {
    const { email, senha } = req.body;

    const biblioteca = await Biblioteca.findOne({email}).select('+senha');

    if(!biblioteca)
        return res.status(400).send({ error: 'Biblioteca not found'});

    if(!await bcrypt.compare(senha, biblioteca.senha))
        return res.status(400).send({ error: 'Invalid password'});

    biblioteca.senha = undefined;

    res.send({ 
        token: generateToken({ id: biblioteca.id }),
        bibliotecaid: biblioteca.id, 
    });
});

router.post('/registrar', async (req, res) => {
    
    try{
    
        const { nome, nomeResponsavel, enderecoBiblioteca, telefone1, telefone2, email, emailResponsavel, senha } = req.body;

        if(await Biblioteca.findOne({ email })){
            return res.status(400).send({error: 'Item already exists'});
        }
    
       const biblioteca = await Biblioteca.create({nome, nomeResponsavel, telefone1, telefone2, email, emailResponsavel, senha});
       
       if(enderecoBiblioteca != null){
            await Promise.all(enderecoBiblioteca.map(async end =>{
                const endentre = new EnderecoBiblioteca({...end, biblioteca: biblioteca._id});
                await endentre.save();
                biblioteca.enderecoBiblioteca.push(endentre);
            }));
        }
        
        await biblioteca.save();

        return res.send({
            biblioteca,
            token: generateToken({ id: biblioteca.id }),
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/atualizar/:bibliotecaId', async (req, res) => {
    try{
        const { nome, nomeResponsavel, enderecoBiblioteca, telefone1, telefone2, email, emailResponsavel } = req.body;
    
        const biblioteca = await Biblioteca.findByIdAndUpdate(req.params.bibliotecaId, { 
            nome,
            nomeResponsavel,
            telefone1,
            telefone2,
            emailResponsavel
            });
            
        biblioteca.enderecoBiblioteca = [];
    
        await EnderecoBiblioteca.deleteMany({ biblioteca: biblioteca._id});
    
        await Promise.all(enderecoBiblioteca.map(async end =>{
            const endbibli = new EnderecoBiblioteca({...end, biblioteca: biblioteca._id});
            await endbibli.save();
            biblioteca.enderecoBiblioteca.push(endbibli);
        }));
    
        await biblioteca.save();
    
        return res.send( {
            result:'Update Succesful',
            token: generateToken({ id: biblioteca.id }),});
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Update failed'});
}});

router.delete('/:bibliotecaId', async (req, res) => {
    try{
       
        await Biblioteca.findByIdAndRemove(req.params.bibliotecaId).populate('enderecoBiblioteca')
        await EnderecoBiblioteca.findOneAndRemove({entregador: req.params.bibliotecaId});
        return res.send({log: 'Deleted Succesfully'})
 
     } catch (err) {
         console.log(err);
         return res.status(400).send({ error: 'Error deleting user' });
     }
});

module.exports = app => app.use('/biblioteca', router);