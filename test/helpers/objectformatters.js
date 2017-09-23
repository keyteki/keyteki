/* global jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const BaseCard = require('../../server/game/basecard.js');
const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');

// Add custom toString methods for better Jasmine output
function formatObject(...keys) {
    return function() {
        let properties = _.pick(this, ...keys);
        let formattedProperties = _.map(_.pairs(properties), ([key, value]) => key + ': ' + jasmine.pp(value));
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

BaseCard.prototype.toString = formatObject('name', 'location');
Player.prototype.toString = formatObject('name');

Game.prototype.toString = function() {
    return 'Game';
};