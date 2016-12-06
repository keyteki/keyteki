const _ = require('underscore');
const path = require('path');
const fs = require('fs');

const plots = require('./plots');
const locations = require('./locations');
const characters = require('./characters');
const attachments = require('./attachments');
const events = require('./events');

var cards = {};

_.each(fs.readdirSync(path.join(__dirname, 'agendas')), file => {
    var card = require('./agendas/' + file);

    cards[card.code] = card;
});

cards = _.extend(cards, plots, locations, characters, attachments, events);

module.exports = cards;
