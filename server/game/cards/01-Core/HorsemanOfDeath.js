const Card = require('../../Card.js');

class HorsemanOfDeath extends Card {
    // Play: Return each Horseman creature from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.player.discard.filter(
                    (card) => card.type === 'creature' && card.hasTrait('horseman')
                )
            }))
        });
    }
}

HorsemanOfDeath.id = 'horseman-of-death';

module.exports = HorsemanOfDeath;
