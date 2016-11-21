var _ = require('underscore');
var plots = require('./plots');
var locations = require('./locations');
var characters = require('./characters');
var attachments = require('./attachments');

var cards = {};

cards = _.extend(cards, plots, locations, characters, attachments);

module.exports = cards;
