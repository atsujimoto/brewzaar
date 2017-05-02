var express = require('express');
var router = express.Router();
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
    }, function(user) {
        res.redirect('/profile');
    });
});

module.exports = router;
