const Card = require('../../Card.js');

class Shadys extends Card {
    // Action: Play a creature from your discard pile. If that
    // creature is Purse-a-phone, destroy Shadys.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.playCard()
            },
            then: (preThenContext) => ({
                condition: () => preThenContext.target.name === 'Purse-a-phone',
                gameAction: ability.actions.destroy((context) => ({
                    target: context.source
                }))
            })
        });
    }
}

Shadys.id = 'shadys';

module.exports = Shadys;
