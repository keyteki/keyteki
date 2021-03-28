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
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents.filter((event) => !event.cancelled),
                message:
                    '{0} uses {1} to sacrifice {3} and cause each player to lose {4} amber; {0} gains 1 chain',
                messageArgs: (context) => {
                    return [
                        context.preThenEvent.card,
                        Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                    ];
                },
                gameAction: [
                    ability.actions.loseAmber((context) => ({
                        amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                    })),
                    ability.actions.loseAmber((context) => ({
                        target: context.player,
                        amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                    })),
                    ability.actions.gainChains()
                ]
            }
        });
    }
}

PowerOfFire.id = 'power-of-fire';

module.exports = PowerOfFire;
