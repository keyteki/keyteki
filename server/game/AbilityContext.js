const BaseAbility = require('./baseability.js');

class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source || {};
        this.player = properties.player;
        this.ability = properties.ability || new BaseAbility({});
        this.costs = {};
        this.targets = {};
        this.stage = 'pretarget';
    }
}

module.exports = AbilityContext;
