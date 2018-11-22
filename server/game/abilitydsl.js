const Effects = require('./effects.js');
const GameActions = require('./GameActions');
const AbilityLimit = require('./abilitylimit');
const Costs = require('./costs.js');

const AbilityDsl = {
    actions: GameActions,
    costs: Costs,
    effects: Effects,
    limit: AbilityLimit
};

module.exports = AbilityDsl;
