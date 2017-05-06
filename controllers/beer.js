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
            name: req.body.name,
            styleId: req.body.style,
            description: req.body.description,
            abv: req.body.abv,
            ibu: req.body.ibu,
            brewery: req.body.brewery
        }
    }, function(error, httpResponse, body) {
        var apiResponse = JSON.parse(body);
        console.log(apiResponse);
        var message = apiResponse.message;
        var id = apiResponse.data.id;

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
            var match = false;

            searchedBeer.ownedBy.forEach(function(owner) {
                if (owner === userId) {
                    match = true;
                    return match;
                }
            });

            if (match) {
                req.flash('Error', 'You have already added this beer');
                console.log(req.session);
                res.redirect('/profile');
            } else {
                User.findByIdAndUpdate(userId, { $push: { ownedBeer: searchedBeer } }, { safe: true, upsert: true }, function(err, model) {
                    if (err) {
                        console.log(err);
                    }
                });
                Beer.findByIdAndUpdate(beer, { $push: { ownedBy: userId } }, { safe: true, upsert: true }, function(err, model) {
                    if (err) {
                        console.log(err);
                    }
                });
                req.flash('Success', 'Beer added');
                res.redirect('/profile');
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
                        console.log(err);
                    }
                    res.redirect('/profile');
                });
                User.findByIdAndUpdate(userId, { $push: { ownedBeer: newBeer } }, { safe: true, upsert: true }, function(err, model) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    });
});

router.get('/add/wanted/:id', function(req, res) {
    var id = req.params.id;
    var searchedBeer;
    var userId = req.user.id;

    Beer.find({ beerId: id }, function(error, beer) {
        searchedBeer = beer[0];

        if (searchedBeer !== undefined) {
            var match = false;

            searchedBeer.wantedBy.forEach(function(owner) {
                if (owner === userId) {
                    match = true;
                    return match;
                }
            });

            if (match) {
                req.flash('Error', 'You have already added this beer');
                console.log(req.session);
                res.redirect('/profile');
            } else {
                User.findByIdAndUpdate(userId, { $push: { wantedBeer: searchedBeer } }, { safe: true, upsert: true }, function(err, model) {
                    if (err) {
                        console.log(err);
                    }
                });
                Beer.findByIdAndUpdate(beer, { $push: { wantedBy: userId } }, { safe: true, upsert: true }, function(err, model) {
                    if (err) {
                        console.log(err);
                    }
                });
                req.flash('Success', 'Beer added');
                res.redirect('/profile');
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
                    ownedBy: [],
                    wantedBy: [userId]
                });

                newBeer.save(function(err) {
                    if (err) {
                        res.redirect('/profile');
                        console.log(err);
                    }
                    res.redirect('/profile');
                });
                User.findByIdAndUpdate(userId, { $push: { wantedBeer: newBeer } }, { safe: true, upsert: true }, function(err, model) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    });
});

router.get('/users/wanted/:id', function(req, res) {
    var id = req.params.id;

    User.find({ wantedBeer: id }, function(err, users) {
        res.render('beer/wantedUsers', { users: users });
    });
});

router.get('/users/owned/:id', function(req, res) {
    var id = req.params.id;

    User.find({ ownedBeer: id }, function(err, users) {
        res.render('beer/ownedUsers', { users: users });
    });
});


module.exports = router;
