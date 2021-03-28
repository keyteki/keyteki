const Card = require('../../Card.js');

class NogiSmartfist extends Card {
    setupCardAbilities(ability) {
        this.fight({
            effect: 'draw 2 cards and discard 2 cards at random',
            gameAction: ability.actions.sequential([
                ability.actions.draw({ amount: 2 }),
                ability.actions.discardAtRandom((context) => ({
                    amount: 2,
                    target: context.player
                }))
            ])
        });
    }
}

NogiSmartfist.id = 'nogi-smartfist';

module.exports = NogiSmartfist;
