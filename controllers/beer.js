var express = require('express');
var router = express.Router();
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var Beer = require('../models/beer');
var User = require('../models/user');
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


router.get('/add/owned/:id', isLoggedIn, function(req, res) {
    var id = req.params.id;
    var searchedBeer;
    var userId = req.user.id;

    Beer.find({ beerId: id }, function(error, beer) {
        searchedBeer = beer[0];

        if (searchedBeer !== undefined) {
            if (searchedBeer.ownedBy.length > 0) {
                searchedBeer.ownedBy.forEach(function(owner) {
                    if (owner == userId) {
                        req.flash('Error', 'You have already added this beer');
                        res.redirect('/profile');
                    }
                });
                User.findByIdAndUpdate(userId, { $push: { ownedBeer: searchedBeer } }, { safe: true, upsert: true }, function(err, model) {
                    console.log(err);
                });
            } else {
                User.findByIdAndUpdate(userId, { $push: { ownedBeer: searchedBeer } }, { safe: true, upsert: true }, function(err, model) {
                    console.log(err);
                });
            }
        } else {
            request(url + 'beer/' + id + '?withBreweries=y' + '&key=' + key, function(error, response, body) {
                var createdBeer = JSON.parse(body);
                var icon;

                if (typeof createdBeer.data.labels != 'undefined') {
                    icon = createdBeer.data.labels.icon;
                }

                var newBeer = new Beer({
                    beerId: createdBeer.data.id,
                    beerName: createdBeer.data.name,
                    breweryId: createdBeer.data.breweries[0].id,
                    breweryName: createdBeer.data.breweries[0].name,
                    icon: icon,
                    ownedBy: [userId],
                    wantedBy: []
                });

                newBeer.save(function(err) {
                    if (err) {
                        res.redirect('/profile');
                        return console.log(err);
                    }
                    res.redirect('/profile');
                });
                User.findByIdAndUpdate(userId, { $push: { ownedBeer: newBeer } }, { safe: true, upsert: true }, function(err, model) {
                    console.log(err);
                });
            });
        }
    });
});

router.get('/add/wanted/:id', function(req, res) {
    var id = req.params.id;
});

module.exports = router;
