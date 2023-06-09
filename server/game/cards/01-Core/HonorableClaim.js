const Card = require('../../Card.js');

class HonorableClaim extends Card {
    // Play: Each friendly Knight creature captures 1<A>.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.player.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.hasTrait('knight')
                )
            }))
        });
    }
}

HonorableClaim.id = 'honorable-claim';

module.exports = HonorableClaim;
