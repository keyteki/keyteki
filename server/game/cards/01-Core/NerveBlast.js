const Card = require('../../Card.js');

class NerveBlast extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            }
        });
    }
}

NerveBlast.id = 'nerve-blast';

module.exports = NerveBlast;
