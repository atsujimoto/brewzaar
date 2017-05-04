require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passportConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var app = express();
var mongoose = require('mongoose');
var request = require('request');
var User = require('./models/user');
var url = 'https://api.brewerydb.com/v2/';
var key = process.env.BREWERY_DB_API;

mongoose.connect('mongodb://localhost/brewzaar');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
    var id = req.user.id;

    User.findById(id, function(error, user) {
        res.render('profile', { user: user });
    });
});

app.get('/search', function(req, res) {
    res.render('searchForm');
});

app.get('/brewery/show/:id', function(req, res) {
    var id = req.params.id;

    request(url + 'brewery/' + id + '?key=' + key, function(error, response, body) {
        res.render('breweryShow', { brewery: JSON.parse(body) });
    });
});

app.use('/login', require('./controllers/login'));
app.use('/signup', require('./controllers/signup'));
app.use('/results', require('./controllers/results'));
app.use('/beer', require('./controllers/beer'));

app.listen(process.env.PORT || 3000);
