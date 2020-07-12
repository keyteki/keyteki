const _ = require('underscore');

const Card = require('../../server/game/Card.js');
const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');

// Add custom toString methods for better Jasmine output
function formatObject(...keys) {
    return function () {
        let properties = _.pick(this, ...keys);
        let formattedProperties = _.map(
            _.pairs(properties),
            ([key, value]) => key + ': ' + jasmine.pp(value)
        );
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

Card.prototype.toString = formatObject('name', 'location');
Player.prototype.toString = formatObject('name');

Game.prototype.toString = function () {
    return 'Game';
};
