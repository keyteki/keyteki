const Card = require('../../Card.js');

class DarkCenturion extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({ amount: 1 })
            },
            then: context => ({
                gameAction: ability.actions.addWardToken({
                    target: context.target[0]
                })
            })
        });
    }
}

DarkCenturion.id = 'dark-centurion';
module.exports = DarkCenturion;
