var mongoose = require('mongoose');

var BeerSchema = new mongoose.Schema({
    beerId: { type: String },
    beerName: { type: String },
    breweryId: { type: String },
    breweryName: { type: String },
    icon: { type: String },
    ownedBy: [{ type: String, ref: 'User' }],
    wantedBy: [{ type: String, ref: 'User' }]
});

module.exports = mongoose.model('Beer', BeerSchema);
