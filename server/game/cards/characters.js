const _ = require('underscore');
const factionCharacterCostReducer = require('./reducer.js').factionCharacterCostReducer;

var characters = {};

// 01028 - Littlefinger
characters['01028'] = {
    register: function(game, player, card) {
        card.income = 1;
        // TODO: Draw cards after marshal
    },
    unregister: function(game, player, card) {
    }
};

// 01056 - Dragonstone Faithful
characters['01056'] = factionCharacterCostReducer('baratheon');

// 01074 - Iron Islands Fishmonger
characters['01074'] = factionCharacterCostReducer('greyjoy');

// 01076 - Salty Navigator
characters['01076'] = {
    register: function(game, player, card) {
        card.initiative = 1;
    },
    unregister: function(game, player, card) {
    }
};

// 01090 - Tywin Lannister
characters['01090'] = {
    register: function(game, player, card) {
        card.income = 2;
        // TODO: Strength increase from gold pool.
    },
    unregister: function(game, player, card) {
    }
};

// 01093 - Lannisport Moneylender
characters['01093'] = {
    register: function(game, player, card) {
        card.income = 1;
    },
    unregister: function(game, player, card) {
    }
};

// 01094 - Lannisport Merchant
characters['01094'] = factionCharacterCostReducer('lannister');

// 01110 - Desert Scavenger
characters['01110'] = factionCharacterCostReducer('martell');

// 01127 -  Samwell Tarly
characters['01127'] = {
    register: function(game, player, card) {
        card.reserve = 1;
    },
    unregister: function(game, player, card) {
    }
};

// 01133 - Steward At The Wall
characters['01133'] = factionCharacterCostReducer('thenightswatch');

// 01152 - Winterfell Steward
characters['01152'] = factionCharacterCostReducer('stark');

// 01170 - Targaryen Loyalist
characters['01170'] = factionCharacterCostReducer('targaryen');

// 01182 - Paxter Redwyne
characters['01182'] = {
    register: function(game, player, card) {
        card.income = 1;
        // TODO: Event cost reduction
    },
    unregister: function(game, player, card) {
    }
};

// 01188 - Garden Caretaker
characters['01188'] = factionCharacterCostReducer('tyrell');

module.exports = characters;
