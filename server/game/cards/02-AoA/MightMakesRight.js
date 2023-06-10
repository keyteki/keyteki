const Card = require('../../Card.js');

class MightMakesRight extends Card {
    // Play: You may sacrifice any number of creatures with total power of 25or more. If you do, forge a key at no cost.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.reduce((total, c) => total + c.power, 0) >= 25,
            target: {
                optional: true,
                mode: 'minStat',
                controller: 'self',
                cardType: 'creature',
                minStat: () => 25,
                cardStat: (card) => card.power,
                gameAction: ability.actions.sacrifice()
            },
            then: {
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents
                        .filter((event) => !event.cancelled)
                        .reduce((total, event) => total + event.clone.modifiedPower, 0) >= 25,
                gameAction: ability.actions.forgeKey({
                    atNoCost: true
                })
            }
        });
    }
}

MightMakesRight.id = 'might-makes-right';

module.exports = MightMakesRight;
