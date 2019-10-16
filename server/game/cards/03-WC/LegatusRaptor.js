const Card = require('../../Card.js');

class LegatusRaptor extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                optional: true,
                cardType: 'creature',
                cardCondition: (card, context) => card === context.source,
                gameAction: ability.actions.exalt()
            },
            then: {
                target: {
                    cardType: 'creature',
                    cardCondition: (card, context) => card !== context.source,
                    controller: 'self',
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.use()
                    ])
                }
            }
        });
    }
}

LegatusRaptor.id = 'legatus-raptor';

module.exports = LegatusRaptor;
