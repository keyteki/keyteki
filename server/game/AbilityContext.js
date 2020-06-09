const BaseAbility = require('./baseability.js');
const EffectSource = require('./EffectSource.js');

class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source || new EffectSource(this.game);
        this.player = properties.player;
        this.ability = properties.ability || new BaseAbility({});
        this.targets = properties.targets || {};
        this.selects = properties.selects || {};
        this.houses = properties.houses || {};
        this.ignoreHouse = false;
    }

    copy(newProps) {
        let copy = new AbilityContext(Object.assign({}, this.getProps(), newProps));
        for (const property of ['target', 'select', 'house', 'preThenEvent', 'preThenEvents']) {
            copy[property] = this[property];
        }

        return copy;
    }

    getProps() {
        return {
            game: this.game,
            source: this.source,
            player: this.player,
            ability: this.ability,
            targets: Object.assign({}, this.targets),
            selects: Object.assign({}, this.selects),
            houses: Object.assign({}, this.houses),
            ignoreHouse: this.ignoreHouse
        };
    }
}

module.exports = AbilityContext;
