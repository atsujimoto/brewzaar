var express = require('express');
var router = express.Router();
var request = require('request');
var url = 'https://api.brewerydb.com/v2/beer/';
var key = process.env.BREWERY_DB_API;

router.get('/:id', function(req, res) {
    var id = req.params.id;
    request(url + id + '?key=' + key, function(error, response, body) {
        res.render('beer', { beer: JSON.parse(body) });
    });

});

module.exports = router;
