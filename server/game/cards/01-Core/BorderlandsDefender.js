const DrawCard = require('../../drawcard.js');

class BorderlandsDefender extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.isDefending(),
            effect: [
                ability.effects.cardCannot('sendHome', context => context && context.player === this.controller.opponent),
                ability.effects.cardCannot('bow', context => context && context.source.type !== 'ring' && context.player === this.controller.opponent)
            ]
        });
    }
}

BorderlandsDefender.id = 'borderlands-defender';

module.exports = BorderlandsDefender;
