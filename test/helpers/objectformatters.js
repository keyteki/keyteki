const _ = require('underscore');

const Card = require('../../server/game/Card.js');
const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');

// Pretty print a value for test output
function pp(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `'${value}'`;
    if (typeof value === 'object') {
        if (value.name) return value.name;
        return JSON.stringify(value);
    }
    return String(value);
}

// Add custom toString methods for better test output
function formatObject(...keys) {
    return function () {
        let properties = _.pick(this, ...keys);
        let formattedProperties = _.map(
            _.pairs(properties),
            ([key, value]) => key + ': ' + pp(value)
        );
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

Card.prototype.toString = formatObject('name', 'location');
Player.prototype.toString = formatObject('name');

Game.prototype.toString = function () {
    return 'Game';
};
