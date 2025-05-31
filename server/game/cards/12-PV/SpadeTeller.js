const Card = require('../../Card.js');

class SpadeTeller extends Card {
    // Play/After Fight/After Reap: Choose a house. Discard the top card of your deck. If that card belongs to the chosen house, gain 1.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'house'
            },
            effect: 'choose {1} and discard {2}',
            effectArgs: (context) => [context.house, context.player.deck[0]],
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.length ? context.player.deck[0] : []
            })),
            then: (preThenContext) => ({
                condition: (context) =>
                    !!context.preThenEvent.card &&
                    context.preThenEvent.card.hasHouse(preThenContext.house),
                gameAction: ability.actions.gainAmber(),
                message: '{0} uses {1} to gain 1 amber'
            })
        });
    }
}

SpadeTeller.id = 'spade-teller';

module.exports = SpadeTeller;
