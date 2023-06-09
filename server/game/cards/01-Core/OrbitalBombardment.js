const Card = require('../../Card.js');

class OrbitalBombardment extends Card {
    // Play: Reveal any number of Mars cards from your hand. For each card revealed this way, deal 2D to a creature. (You may choose a different creature each time.)
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose which cards to reveal',
                mode: 'unlimited',
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.allocateDamage((context) => ({
                    numSteps: context.target.length,
                    damageStep: 2
                }))
            },
            effect: 'reveal {0} to deal 2 damage to a creature {1} times',
            effectArgs: (context) => context.target.length
        });
    }
}

OrbitalBombardment.id = 'orbital-bombardment';

module.exports = OrbitalBombardment;
