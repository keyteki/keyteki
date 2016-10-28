var _ = require('underscore');
var plots = require('./plots.js');
var locations = require('./locations.js');

var cards = {};

cards = _.extend(cards, plots, locations);

module.exports = cards;
