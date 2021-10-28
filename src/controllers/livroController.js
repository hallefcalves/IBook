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

router.get('/:livroId', async (req, res)=>{
    try{
        const livros = await livro.findById(req.params.livroId)

        return res.send({ livros })
    } catch (err) {
        return res.status(400).send({ error: 'Error loading' });
    }
});

router.post('/', async (req, res) => {
    
    try{

       const livro = await livro.create(req.body);
    
        await livro.save();

        return res.send({
            livro,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.put('/:livroId', async (req, res) => {
    try{
        const livro = await livro.findByIdAndUpdate(req.params.livroId, req.body);
    
        await livro.save();
    
        return res.send( {result:'Update Succesful'});
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Update failed'});
}});

router.delete('/:livroId', async (req, res) => {
    try{
       
        await livro.findByIdAndRemove(req.params.livroId)
        return res.send({log: 'Deleted Succesfully'})
 
     } catch (err) {
         console.log(err);
         return res.status(400).send({ error: 'Error deleting user' });
     }
});

module.exports = app => app.use('/livro', router);