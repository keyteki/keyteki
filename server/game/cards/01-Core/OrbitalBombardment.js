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
            effect: '{1}',
            effectArgs: (context) => {
                const n = context.target.length;
                return n
                    ? `reveal ${n} Mars card${
                          n === 1 ? '' : 's'
                      } and deal 2 damage to a creature ${n} time${n === 1 ? '' : 's'}`
                    : 'reveal no Mars cards from their hand';
            }
        });
    }
}

OrbitalBombardment.id = 'orbital-bombardment';

module.exports = OrbitalBombardment;
