const Card = require('../../Card.js');

class AbandonShip extends Card {
    // (T) Play: Return a creature to its owner’s hand. If the tide is high, return 4 creatures to their owners’ hands instead.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                numCards: (context) => (context.player.isTideHigh() ? 4 : 1),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

AbandonShip.id = 'abandon-ship';

module.exports = AbandonShip;
