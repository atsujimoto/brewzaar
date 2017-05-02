var express = require('express');
var router = express.Router();
var passport = require('../config/passportConfig');

router.get('/', function(req, res) {
    res.render('loginForm');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Login successful',
    failureRedirect: '/login',
    failureFlash: 'Failed login.  Try again'
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('Success', 'Logged out');
    res.redirect('/');
});

module.exports = router;
