const Card = require('../../Card.js');

class RumorSower extends Card {
    // After Reap: Your opponent discards the top card of their
    // deck. Stun an enemy creature that shares a house with the
    // discarded card.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.opponent && context.player.opponent.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck[0],
                location: 'deck'
            })),
            then: {
                target: {
                    cardCondition: (card, context) =>
                        context.preThenEvent.card.getHouses().some((h) => card.hasHouse(h)),
                    cardType: 'creature',
                    controller: 'opponent'
                },
                gameAction: ability.actions.stun((context) => ({
                    target: context.target
                })),
                message: '{0} uses {1} to stun {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

RumorSower.id = 'rumor-sower';

module.exports = RumorSower;
