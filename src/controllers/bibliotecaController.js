const express = require('express');

const Biblioteca = require('../models/Biblioteca');

const Usuario = require('../models/Biblioteca');

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

    
       const biblioteca = await Biblioteca.create(req.body);
        
        await biblioteca.save();

        return res.send({
            biblioteca
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/:bibliotecaId', async (req, res) => {
    try{
        let bib = await Biblioteca.findByIdAndUpdate(bibliotecaId, req.body)

        return res.send({ bib });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Update failed'});
}});

router.delete('/:bibliotecaId', async (req, res) => {
    try{
       
       await Biblioteca.findByIdAndRemove(req.params.bibliotecaId)

       return res.send({log: 'Deleted Succesfully'})

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting' });
    }
});

module.exports = app => app.use('/biblioteca', router);