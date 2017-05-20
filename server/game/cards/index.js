const _ = require('underscore');
const path = require('path');
const fs = require('fs');

const strongholds = require('./strongholds');
const provinces = require('./provinces');
const holdings = require('./holdings');
const characters = require('./characters');
const attachments = require('./attachments');
const events = require('./events');

var cards = {};

cards = _.extend(cards, strongholds, provinces, holdings, characters, attachments, events);

module.exports = cards;
