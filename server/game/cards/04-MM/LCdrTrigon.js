const Card = require('../../Card.js');

class LCdrTrigon extends Card {
    // Reap: Discard the top card of your deck. Resolve that cards bonus icons as if you had played it.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 1)
            })),
            then: {
                gameAction: ability.actions.resolveBonusIcons((context) => ({
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

LCdrTrigon.id = 'lcdr-trigon';

module.exports = LCdrTrigon;
