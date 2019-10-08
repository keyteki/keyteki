const Card = require('../../Card.js');

class HitAndRun extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand()
                },
                message: '{0} uses {1} to return {2} to their hands'
            }
        });
    }
}

HitAndRun.id = 'hit-and-run';

module.exports = HitAndRun;
