const Card = require('../../Card.js');

class ZYXResearcher extends Card {
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
