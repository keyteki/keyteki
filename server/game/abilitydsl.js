const Effects = require('./effects.js');
const GameActions = require('./GameActions');
const AbilityLimit = require('./abilitylimit');

const AbilityDsl = {
    actions: GameActions,
    effects: Effects,
    limit: AbilityLimit
};

module.exports = AbilityDsl;
