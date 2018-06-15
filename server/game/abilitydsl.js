const AbilityLimit = require('./abilitylimit.js');
const Effects = require('./effects.js');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');

const AbilityDsl = {
    limit: AbilityLimit,
    effects: Effects,
    costs: Costs,
    actions: GameActions
};

module.exports = AbilityDsl;
