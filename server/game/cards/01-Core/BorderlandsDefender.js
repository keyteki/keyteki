const DrawCard = require('../../drawcard.js');

class BorderlandsDefender extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.isDefending(),
            effect: [
                ability.effects.cannotBeSentHome((card, context) => context && context.source.controller !== this.controller),
                ability.effects.cannotBeBowed((card, context) => context && context.source.type !== 'ring' && context.source.controller !== this.controller)
            ]
        });
    }
}

BorderlandsDefender.id = 'borderlands-defender';

module.exports = BorderlandsDefender;
