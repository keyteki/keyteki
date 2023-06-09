const Card = require('../../Card.js');

class ZYXResearcher extends Card {
    // Play: Archive the top card of your deck or the top card of your discard pile.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    Deck: ability.actions.archive((context) => ({
                        target: context.player.deck[0]
                    })),
                    'Discard pile': ability.actions.archive((context) => ({
                        target: context.player.discard[0]
                    }))
                }
            }
        });
    }
}

ZYXResearcher.id = 'zyx-researcher';

module.exports = ZYXResearcher;
