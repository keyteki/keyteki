const Card = require('../../Card.js');

class TheBigOne extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' && event.card !== context.source
            },
            gameAction: ability.actions.addFuseCounter(),
            then: {
                condition: (context) =>
                    context.source.hasToken('fuse') && context.source.tokens.fuse >= 10,
                message: '{1} has 10 fuse counters and destroys all creatures and artifacts',
                messageArgs: (context) => [context.source],
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay.filter(
                        (card) => card.type === 'artifact' || card.type === 'creature'
                    )
                }))
            }
        });
    }
}

TheBigOne.id = 'the-big-one';

module.exports = TheBigOne;
