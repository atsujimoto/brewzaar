var express = require('express');
var router = express.Router();
var passport = require('../config/passportConfig');
var User = require('../models/user');

router.get('/', function(req, res) {
    res.render('signupForm');
});

router.post('/', function(req, res, next) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address
    });

    newUser.save(function(err) {
        if (err) {
            res.redirect('login');
            return console.log(err);
        }
        passport.authenticate('local', {
            successRedirect: '/profile',
            successFlash: 'Login successful',
            failureRedirect: '/login',
            failureFlash: 'Failed login. Try again'
        })(req, res, next);
    });
});

module.exports = router;
