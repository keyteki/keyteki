const Card = require('../../Card.js');

class DeepProbe extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.opponent.hand.length > 0,
            target: {
                mode: 'house'
            },
            effect: 'discard all {1} cards from {2}\'s hand: {3}',
            effectArgs: context => [context.house, context.player.opponent, context.player.opponent.hand],
            gameAction: ability.actions.discard(context => ({
                target: context.player.opponent.hand.filter(card => card.hasHouse(context.house))
            }))
        });
    }
}

DeepProbe.id = 'deep-probe'; // This is a guess at what the id might be - please check it!!!

module.exports = DeepProbe;
