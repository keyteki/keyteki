const Card = require('../../Card.js');

class PowerOfFire extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to sacrifice',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sacrifice()
            },
            then: {
                condition: context => context.preThenEvents && context.preThenEvents.filter(event => !event.cancelled),
                gameAction: [
                    ability.actions.loseAmber(context => ({ amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2) })),
                    ability.actions.loseAmber(context => ({ target: context.player, amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2) })),
                    ability.actions.gainChains()
                ]
            }
        });
    }
}

PowerOfFire.id = 'power-of-fire';

module.exports = PowerOfFire;
