const Card = require('../../Card.js');

class SuckerPunch extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (context) => ({
                condition: () => context.target.location !== 'play area',
                gameAction: ability.actions.archive()
            })
        });
    }
}

SuckerPunch.id = 'sucker-punch';

module.exports = SuckerPunch;
