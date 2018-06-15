const AbilityLimit = require('./abilitylimit.js');
const Effects = require('./effects.js');
const Costs = require('./costs.js');

const AbilityDsl = {
    limit: AbilityLimit,
    effects: Effects,
    costs: Costs
};

module.exports = AbilityDsl;
