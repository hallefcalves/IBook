const express = require('express');

const livro = require('../models/livro.js');

const Biblioteca = require('../models/biblioteca.js');

//Podemos usar o Router para definir as rotas para o usuário
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const livros = await livro.find()

        return res.send({ livros })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.get('/:bibliotecaId', async (req, res)=>{
    try{
        const livros = await livro.find({biblioteca: req.params.bibliotecaId})
        return res.send({ livros })
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao criar livro' });
    }
});

router.post('/registrar', async (req, res) => {
    
    try{

       const livro = await livro.create(req.body);
    
        await livro.save();

        return res.send({
            _id: livro.id
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/atualizar/:livroId', async (req, res) => {
    try{
        const livro = await livro.findByIdAndUpdate(req.params.livroId, req.body);
    
        await livro.save();
    
        return res.send( {result:'Update Succesful'});
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Update failed'});
}});

router.delete('/apagar/:livroId', async (req, res) => {
    try{
       
        await livro.findByIdAndRemove(req.params.livroId)
        return res.send({log: 'Deleted Succesfully'})
 
     } catch (err) {
         console.log(err);
         return res.status(400).send({ error: 'Error deleting user' });
     }
});

module.exports = app => app.use('/livro', router);