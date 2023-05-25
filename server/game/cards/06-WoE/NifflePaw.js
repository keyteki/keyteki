const Card = require('../../Card.js');

class NifflePaw extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) => event.card === context.source.parent
            },
            gameAction: ability.actions.destroy((context) => ({ target: context.source.parent })),
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to move {1} to {2}',
                target: {
                    numCards: 1,
                    cardType: ['creature'],
                    cardCondition: (card) => card.location === 'play area',
                    gameAction: ability.actions.attach((context) => ({
                        upgrade: context.source
                    }))
                }
            }
        });
    }
}

NifflePaw.id = 'niffle-paw';

module.exports = NifflePaw;
