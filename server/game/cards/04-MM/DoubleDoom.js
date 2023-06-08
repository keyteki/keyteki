const Card = require('../../Card.js');

class DoubleDoom extends Card {
    // Play: Return an enemy creature to its owners hand. Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent'
            },
            gameAction: ability.actions.sequential([
                ability.actions.returnToHand((context) => ({ target: context.target })),
                ability.actions.discardAtRandom((context) => ({ target: context.player.opponent }))
            ]),
            effect: 'return {0} to owners hand and discard random card'
        });
    }
}

DoubleDoom.id = 'double-doom';

module.exports = DoubleDoom;
