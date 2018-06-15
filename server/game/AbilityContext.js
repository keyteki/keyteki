const BaseAbility = require('./baseability.js');
const EffectSource = require('./EffectSource.js');

class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source || new EffectSource(this.game);
        this.player = properties.player;
        this.ability = properties.ability || new BaseAbility({});
        this.costs = {};
        this.targets = {};
        this.rings = {};
        this.selects = {};
        this.stage = 'pretarget';
    }
}

module.exports = AbilityContext;
