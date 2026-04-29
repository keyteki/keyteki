const Card = require('../../Card.js');

class ZzyszzsCompactor extends Card {
    // Action: Put a creature on the bottom of its owner's deck. If you do, give a creature two +1 power counters.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.target.location === 'deck',
                target: {
                    activePromptTitle: 'Choose a creature',
                    cardType: 'creature',
                    gameAction: ability.actions.addPowerCounter({ amount: 2 })
                }
            })
        });
    }
}

ZzyszzsCompactor.id = 'zzyszz-s-compactor';

module.exports = ZzyszzsCompactor;
