var express = require('express');
var router = express.Router();
var request = require('request');
var Beer = require('../models/beer');
var url = 'https://api.brewerydb.com/v2/';
var key = process.env.BREWERY_DB_API;

router.get('/show/:id', function(req, res) {
    var id = req.params.id;
    request(url + 'beer/' + id + '?key=' + key, function(error, response, body) {
        res.render('beer/show', { beer: JSON.parse(body) });
    });

});

router.get('/brewery/', function(req, res) {
    res.render('beer/brewerySearch');
});

router.get('/brewery/show', function(req, res) {
    request(url + 'search?q=' + req.query.brewery + '&type=brewery&key=' + key, function(error, response, body) {
        res.render('beer/breweryShow', { breweries: JSON.parse(body) });
    });
});

router.get('/new/:id', function(req, res) {
    var breweryId = req.params.id;
    request(url + 'styles?key=' + key, function(error, response, body) {
        res.render('beer/new', { styles: JSON.parse(body), breweryId, key });
    });
});

router.post('/new', function(req, res) {
    request.post({
        url: url + 'beers?key=' + key,
        form: {
            name: req.query.name,
            styleId: req.query.style,
            description: req.query.description,
            abv: req.query.abv,
            ibu: req.query.ibu,
            brewery: req.query.brewery
        }
    }, function(error, httpResponse, body) {
        var message = JSON.parse(body).message;
        var id = JSON.parse(body).data.id;

        req.flash('Success', message);
        res.redirect('/beer/show/' + id);
    });
});

router.get('/add/owned/:id', function(req, res) {
    var id = req.params.id;
    var user = req.user.id;
    var beer = Beer.findById({ beerId: id });
    var exists = false;

    request(url + 'beer/' + id + '?key=' + key, function(error, response, body) {
        beer.ownedBy.forEach(function(owner) {
            if (owner == user) {

            }
        });
    });
});

router.get('/add/wanted/:id', function(req, res) {
    var id = req.params.id;
});

module.exports = router;
