const express = require('express');

const User = require('../models/User');

//Podemos usar o Router para definir as rotas para o usuário
const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const user = await User.create(req.body);

        return res.send({ user });
    }
    catch (err) {
        return res.status(400).send.Router({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/auth', router);