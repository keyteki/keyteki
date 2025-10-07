import Card from '../../Card.js';

class Ifraneye extends Card {
    // Play: Discard your hand.
    // After Reap: Your opponent discards 2 random cards from their hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            }))
        });

        this.reap({
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.player.opponent,
                amount: 2
            }))
        });
    }
}

Ifraneye.id = 'ifraneye';

export default Ifraneye;
