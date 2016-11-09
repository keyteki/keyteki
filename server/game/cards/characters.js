const _ = require('underscore');
const factionCostReducer = require('./reducer.js').factionCostReducer;

var characters = {};

// 01056 - Dragonstone Faithful
characters['01506'] = factionCostReducer('baratheon');

// 01074 - Iron Islands Fishmonger
characters['01074'] = factionCostReducer('greyjoy');

// 01094 - Lannisport Merchant
characters['01094'] = factionCostReducer('lannister');

// 01110 - Desert Scavenger
characters['01110'] = factionCostReducer('martell');

// 01133 - Steward At The Wall
characters['01133'] = factionCostReducer('thenightswatch');

// 01152 - Winterfell Steward
characters['01152'] = factionCostReducer('stark');

// 01170 - Targaryen Loyalist
characters['01170'] = factionCostReducer('targaryen');

// 01188 - Garden Caretaker
characters['01188'] = factionCostReducer('tyrell');

module.exports = characters;
