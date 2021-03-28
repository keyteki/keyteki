const Card = require('../../Card.js');

class MothershipSupport extends Card {
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
