const Card = require('../../Card.js');

class LCdrTrigon extends Card {
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
