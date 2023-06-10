const Card = require('../../Card.js');

class DarkCenturion extends Card {
    // Enhance PTPT.
    // Action: Move 1A from a creature to the common supply. If you do, ward that creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({ amount: 1 })
            },
            then: (context) => ({
                gameAction: ability.actions.ward({
                    target: context.target
                })
            })
        });
    }
}

DarkCenturion.id = 'dark-centurion';

module.exports = DarkCenturion;
