const Card = require('../../Card.js');

class BlastShielding extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyArmor(2)
        });
        this.reaction({
            when: {
                onUseCard: (event, context) => event.card === context.source.parent
            },
            target: {
                numCards: 1,
                optional: true,
                cardType: ['creature'],
                gameAction: ability.actions.attach((context) => ({
                    upgrade: this,
                    target: context.source.parent.neighbors
                }))
            }
        });
    }
}

BlastShielding.id = 'blast-shielding';

module.exports = BlastShielding;
