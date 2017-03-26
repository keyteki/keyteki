const DrawCard = require('../../../drawcard.js');

class SwornToTheWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addFaction('thenightswatch')
        });
        this.whileAttached({
            condition: () => this.parent.hasIcon('military'),
            effect: ability.effects.addTrait('Ranger')
        });
        this.whileAttached({
            condition: () => this.parent.hasIcon('intrigue'),
            effect: ability.effects.addTrait('Steward')
        });
        this.whileAttached({
            condition: () => this.parent.hasIcon('power'),
            effect: ability.effects.addTrait('Builder')
        });
    }
}

SwornToTheWatch.code = '07022';

module.exports = SwornToTheWatch;
