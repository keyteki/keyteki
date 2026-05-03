const Card = require('../../Card.js');

class HauntingMeasures extends Card {
    // Play: Discard the top 6 cards of your deck. You may put a non-Geistoid card discarded this way into your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 6)
            })),
            then: {
                target: {
                    controller: 'self',
                    location: 'discard',
                    optional: true,
                    cardCondition: (card, context) =>
                        !card.hasHouse('geistoid') &&
                        context.preThenEvents
                            .filter((e) => !!e.card)
                            .map((e) => e.card)
                            .includes(card),
                    gameAction: ability.actions.returnToHand({
                        location: 'discard'
                    })
                },
                message: '{0} uses {1} to return {2} to hand'
            }
        });
    }
}

HauntingMeasures.id = 'haunting-measures';

module.exports = HauntingMeasures;
