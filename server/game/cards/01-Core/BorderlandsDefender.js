const DrawCard = require('../../drawcard.js');

class BorderlandsDefender extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.isDefending(),
            effect: [
                ability.effects.cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects',
                    source: this
                }),
                ability.effects.cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects',
                    source: this
                })
            ]
        });
    }
}

BorderlandsDefender.id = 'borderlands-defender';

module.exports = BorderlandsDefender;
