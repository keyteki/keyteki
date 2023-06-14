const Card = require('../../Card.js');

class MothershipSupport extends Card {
    // Play: For each friendly ready Mars creature, deal 2D to a creature. (You may choose a different creature each time.)
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to a creature for each ready Mars creature they control',
            gameAction: ability.actions.allocateDamage((context) => ({
                damageStep: 2,
                numSteps: context.player.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.hasHouse('mars') && !card.exhausted
                ).length
            }))
        });
    }
}

MothershipSupport.id = 'mothership-support';

module.exports = MothershipSupport;
