const Card = require('../../Card.js');

class MightyJavelin extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            },
            effect: 'sacrifice {1} and deal 4 damage to {0}',
            effectArgs: context => context.source,
            gameAction: ability.actions.sacrifice()
        });
    }
}

MightyJavelin.id = 'mighty-javelin';

module.exports = MightyJavelin;
