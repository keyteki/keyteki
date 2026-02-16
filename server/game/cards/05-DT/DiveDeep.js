const Card = require('../../Card.js');

class DiveDeep extends Card {
    // Play: Discard the top card of your opponent's deck. Put a creature that shares a house with that card on the bottom of its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent.deck.length > 0,
            preferActionPromptMessage: true,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(0, 1)
            })),
            then: {
                message: "{0} uses {1} to put {2} on the bottom of {3}'s deck",
                messageArgs: (context) => [context.target.controller],
                target: {
                    cardCondition: (card, context) =>
                        context.preThenEvent.card.getHouses().some((house) => card.hasHouse(house)),
                    cardType: 'creature',
                    gameAction: ability.actions.returnToDeck({ bottom: true })
                }
            }
        });
    }
}

DiveDeep.id = 'dive-deep';

module.exports = DiveDeep;
