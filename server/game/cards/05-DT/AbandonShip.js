import Card from '../../Card.js';

class AbandonShip extends Card {
    // (T) Play: Return a creature to its owner’s hand. If the tide is high, return 4 creatures to their owners’ hands instead.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                mode: 'exactly',
                numCards: (context) => (context.player.isTideHigh() ? 4 : 1),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

AbandonShip.id = 'abandon-ship';

export default AbandonShip;
