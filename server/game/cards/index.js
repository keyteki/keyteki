var _ = require('underscore');
var plots = require('./plots.js');
var locations = require('./locations.js');
var characters = require('./characters.js');
var attachments = require('./attachments.js');

var cards = {};

cards = _.extend(cards, plots, locations, characters, attachments);

module.exports = cards;
