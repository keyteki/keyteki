const Card = require('../../Card.js');

class MightMakesRight extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'minStat',
                cardType: 'creature',
                controller: 'self',
                minStat: () => 25,
                cardStat: card => card.power,
                gameAction: ability.actions.sacrifice()
            },
            then: {
                gameAction: ability.actions.forgeKey(context => ({
                    modifier: -context.player.getCurrentKeyCost()
                }))
            }
        });
    }
}

MightMakesRight.id = 'might-makes-right';

module.exports = MightMakesRight;
