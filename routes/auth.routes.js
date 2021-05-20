const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);

const User = require('../models/User.model');

router.get('/signup', (req, res,) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    console.log('Password before hashing it: ', password)
    const hashedPassword = bcryptjs.hashSync(password, salt)
    console.log('Password hashed: ', hashedPassword)

    User.create({
        username,
        passwordHash: hashedPassword
    })
        .then(user => {
            console.log('Newly created user is: ', user),
            res.redirect('/user-profile')
        })
        .catch(err => next(err))
})

router.get('/user-profile', (req, res) => res.render('users/user-profile'))

module.exports = router;