const Card = require('../../Card.js');

class OlPaddy extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                location: 'deck',
                target: context.player.deck.slice(context.player.isTideHigh() ? -3 : -1)
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                    forEach: context.preThenEvent.cards.filter((card) => card.type === 'creature')
                }))
            }
        });
    }
}

OlPaddy.id = 'ol-paddy';

module.exports = OlPaddy;
