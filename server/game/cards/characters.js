const _ = require('underscore');
const factionCharacterCostReducer = require('./reducer.js').factionCharacterCostReducer;

var characters = {};

// 01056 - Dragonstone Faithful
characters['01506'] = factionCharacterCostReducer('baratheon');

// 01074 - Iron Islands Fishmonger
characters['01074'] = factionCharacterCostReducer('greyjoy');

// 01094 - Lannisport Merchant
characters['01094'] = factionCharacterCostReducer('lannister');

// 01110 - Desert Scavenger
characters['01110'] = factionCharacterCostReducer('martell');

// 01133 - Steward At The Wall
characters['01133'] = factionCharacterCostReducer('thenightswatch');

// 01152 - Winterfell Steward
characters['01152'] = factionCharacterCostReducer('stark');

// 01170 - Targaryen Loyalist
characters['01170'] = factionCharacterCostReducer('targaryen');

// 01188 - Garden Caretaker
characters['01188'] = factionCharacterCostReducer('tyrell');

module.exports = characters;
