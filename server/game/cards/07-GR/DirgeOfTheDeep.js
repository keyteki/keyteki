const Card = require('../../Card.js');

class DirgeOfTheDeep extends Card {
    // Play: Discard the bottom card of your opponent’s deck. Exhaust
    // each creature that shares a house with that card.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck[context.player.opponent.deck.length - 1]
            })),
            then: {
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.game.creaturesInPlay.filter((card) =>
                        context.preThenEvent.card.getHouses().some((house) => card.hasHouse(house))
                    )
                })),
                message: '{0} uses {1} to exhaust creatures that share a house with {3}',
                messageArgs: (context) => [context.preThenEvent.card]
            }
        });
    }
}

DirgeOfTheDeep.id = 'dirge-of-the-deep';

module.exports = DirgeOfTheDeep;
