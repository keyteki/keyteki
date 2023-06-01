const Card = require('../../Card.js');

class TheVisibleHand extends Card {
    // Make 2 token creatures. Reveal your hand to your opponent.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make 2 token creatures and reveal their hand: {1}',
            effectArgs: (context) => [context.player.hand.map((card) => card).sort()],
            gameAction: ability.actions.makeTokenCreature({ amount: 2 })
        });
    }
}

TheVisibleHand.id = 'the-visible-hand';

module.exports = TheVisibleHand;
