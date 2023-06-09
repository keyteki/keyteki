const Card = require('../../Card.js');

class DeepProbe extends Card {
    // Play: Choose a house. Reveal your opponent's hand. Discard each creature of that house revealed this way.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.hand.length > 0,
            target: {
                mode: 'house'
            },
            effect: "discard all {1} creature cards from {2}'s hand: {3}",
            effectArgs: (context) => [
                context.house,
                context.player.opponent,
                context.player.opponent.hand
            ],
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.hand.filter(
                    (card) => card.type === 'creature' && card.hasHouse(context.house)
                )
            }))
        });
    }
}

DeepProbe.id = 'deep-probe';

module.exports = DeepProbe;
