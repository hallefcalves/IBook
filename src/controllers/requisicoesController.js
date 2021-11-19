const express = require('express');

const Biblioteca = require('../models/biblioteca.js');
const Livro = require('../models/livro.js');
const Usuario = require('../models/usuario.js');
const Requisicao = require('../models/requisicao.js');

//Podemos usar o Router para definir as rotas para o usuário
const router = express.Router();

router.post('/ask', async (req, res) => {
    try{
        const biblioteca = await Biblioteca.findOne({_id: req.body.bibliotecaId});
        const livro = await Livro.findOne({_id: req.body.livroId});
        const usuario = await Usuario.findOne({_id: req.body.usuarioId});
        if(livro.reservado == false){
            const requisicao = new Requisicao({
                biblioteca: biblioteca_id,
                livro: livro_id,
                usuario: usuario_id,
                dataRequisicao: req.body.dataRequisicao,
                status: req.body.status,
            });
            livro.dataRequisicao = req.body.dataRequisicao;
            await livro.save();
            await requisicao.save();
            res.send(requisicao);
            return res.status(200).send({
                message: 'Requisição realizada com sucesso!',
                requisicao: requisicao  
            });
        }
        else if( livro.reservado == true && livro.usuarioReservado == req.body.usuarioId){
            const requisicao = new Requisicao({
                biblioteca: biblioteca_id,
                livro: livro_id,
                usuario: usuario_id,
                dataRequisicao: req.body.dataRequisicao,
                status: req.body.status,
            });
            livro.dataRequisicao = req.body.dataRequisicao;
            livro.reservado = false;
            livro.usuarioReservado = null;
            await livro.save();
            await requisicao.save();
            return res.status(200).send({
                message: 'Requisição realizada com sucesso!',
                requisicao: requisicao  
            });
        }
        else{
            return res.status(400).send({   message: 'Livro está reservado por outro usuário!' });
        }   
    }
    catch(err){
        return res.status(400).send({ error: 'Erro criando a requisição' });
    }
});

router.put('/renov', async(req, res) => {
    try{
        const livro = await Livro.findOne({_id: req.body.livroId});
        if(livro.reservado == false){
            const requisicao = await Requisicao.findOne({_id: req.body.requisicaoId});
            requisicao.dataDevolucao = datetime.now()+7;
            livro.dataDevolucao = datetime.now()+7;
            await requisicao.update();
            await livro.update();
            return res.status(200).send({
                message: 'Requisição renovada com sucesso!',
                requisicao: requisicao  
            });
        }
        else{
            return res.status(400).send({ error: 'Livro renovado' })
        }
    }
    catch(err){    
        return res.status(400).send({ error: 'Erro renovando a requisição' });
    }
});

router.post('/reserv', async(req, res) => {
    try{
        const livro = await Livro.findOne({_id: req.body.livroId});
        const requisicao = await Requisicao.findOne({_id: req.body.requisicaoId});
        if(livro.reservado == false){
            livro.reservado = true;
            requisicao.status = "Reservado";
            await livro.update();
            await requisicao.update();
            return res.status(200).send({
                message: 'Requisição reservada com sucesso!',
                requisicao: requisicao  
            });
        }
        else{
            return res.status(400).send({ error: 'Livro reservado' })
        }
    }
    catch(err){
        return res.status(400).send({ error: 'Erro ao reservar livro' });
    }
});

router.post('/devol', async(req, res) => {
    try{
        const livro = await Livro.findOne({_id: req.body.livroId});
        const requisicao = await Requisicao.findOne({_id: req.body.requisicaoId});
        if(livro.reservado == true){
            livro.reservado = false;
            requisicao.status = "Devolvido";
            await livro.update();
            await requisicao.update();
            return res.status(200).send({
                message: 'Requisição devolvida com sucesso!',
                requisicao: requisicao  
            });
        }
        else{
            return res.status(400).send({ error: 'Livro não está reservado' })
        }
    }
    catch(err){
        return res.status(400).send({ error: 'Erro ao devolver livro' });
    }
});

module.exports = app => app.use('/req', router);