const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);

const User = require('../models/User.model');



router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser})
})

//
// Main & PRIVATE PAGE
//
router.get('/main', (req, res) => res.render('main'))

router.get('/private', (req, res, next) => {
    if (req.session.currentUser) {
        res.render('users/private')
    } else {
        res.redirect('/login')
    }
})


//
// SIGN UP
//

router.get('/signup', (req, res,) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, salt)

    User.create({
        username,
        passwordHash: hashedPassword
    })
        .then(user => {
            res.redirect('/user-profile')
        })
        .catch(err => next(err))
})



//
// LOGIN
//

router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', (req, res, next) => {    
    const {username, password} = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: "Please enter both, email and password to login."
        });
        return;
    }

    User.findOne({username})
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: "Mail is not registered. Try with another email."
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('userProfile')
            } else {
                res.render('auth/login', {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(err => next(err))
})


//
// LOGOUT
//

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})



module.exports = router;