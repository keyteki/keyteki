const Card = require('../../Card.js');

class TheWitchingHour extends Card {
    // Play: Return each Witch creature from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.player.discard.filter(
                    (card) => card.type === 'creature' && card.hasTrait('witch')
                )
            }))
        });
    }
}

TheWitchingHour.id = 'the-witching-hour';

module.exports = TheWitchingHour;
