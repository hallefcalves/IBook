const express = require('express');

const Biblioteca = require('../models/Biblioteca');

const Usuario = require('../models/Biblioteca');
const EnderecoBiblioteca = require('../models/endereco/enderecoBiblioteca');

//Podemos usar o Router para definir as rotas para o usuário
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const bibliotecas = await Biblioteca.find()

        return res.send({ bibliotecas })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.get('/:bibliotecaId', async (req, res)=>{
    try{
        const bibliotecas = await Biblioteca.findById(req.params.bibliotecaId)

        return res.send({ bibliotecas })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.post('/', async (req, res) => {
    
    try{
    
        const { nome, nomeResponsavel, enderecoBiblioteca, telefone1, telefone2, email, emailResponsavel } = req.body;

        if(await Biblioteca.findOne({ nome })){
            return res.status(400).send({error: 'Item already exists'});
        }
    
       const biblioteca = await Biblioteca.create({nome, nomeResponsavel, telefone1, telefone2, email, emailResponsavel});
       
       await Promise.all(enderecoBiblioteca.map(async end =>{
           const endentre = new EnderecoBiblioteca({...end, biblioteca: biblioteca._id});
           await endentre.save();
           biblioteca.enderecoBiblioteca.push(endentre);
        }));
        
        await biblioteca.save();

        return res.send({
            biblioteca,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/:bibliotecaId', async (req, res) => {
    try{
        const { nome, nomeResponsavel, enderecoBiblioteca, telefone1, telefone2, email, emailResponsavel } = req.body;
    
        const biblioteca = await Biblioteca.findByIdAndUpdate(req.params.bibliotecaId, { 
            nome,
            nomeResponsavel,
            telefone1,
            telefone2,
            email,
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
    
        return res.send( {result:'Update Succesful'});
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