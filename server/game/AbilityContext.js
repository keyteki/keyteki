class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source;
        this.player = properties.player;
        this.ability = properties.ability;
        this.costs = {};
        this.targets = {};
        this.stage = 'pretarget';
    }
}

module.exports = AbilityContext;
