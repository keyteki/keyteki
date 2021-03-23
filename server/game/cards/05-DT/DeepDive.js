const Card = require('../../Card.js');

class DeepDive extends Card {
    //Play: Discard the top card of your opponent's deck. Put a creature that shares a house with the discarded card on the bottom of its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(0)
            })),
            then: {
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

DeepDive.id = 'deep-dive';

module.exports = DeepDive;
