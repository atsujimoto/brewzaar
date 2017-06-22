var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var url = 'https://api.brewerydb.com/v2/search?q=';
var key = process.env.BREWERY_DB_API;

router.use(express.static(path.join(__dirname, '../public')));

router.get('/beers', function(req, res) {
    request(url + req.query.beer + '&type=beer&key=' + key, function(error, response, body) {
        res.render('results', { beers: JSON.parse(body) });
    });
});

router.get('/breweries', function(req, res) {
    request(url + req.query.brewery + '&type=brewery&key=' + key, function(error, response, body) {
        res.render('results', { breweries: JSON.parse(body) });
    });
});

module.exports = router;
