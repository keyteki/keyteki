const Card = require('../../Card.js');

class OlPaddyEvilTwin extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                location: 'deck',
                target: context.player.opponent
                    ? context.player.opponent.deck.slice(context.player.isTideHigh() ? -3 : -1)
                    : []
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'any',
                    cardCondition: (card, context) =>
                        context.preThenEvent.cards.some((c) => card.hasHouse(c.printedHouse)),
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

OlPaddyEvilTwin.id = 'ol-paddy-evil-twin';

module.exports = OlPaddyEvilTwin;
