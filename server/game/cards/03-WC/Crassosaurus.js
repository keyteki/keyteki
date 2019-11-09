const Card = require('../../Card.js');

class Crassosaurus extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            target: {
                activePromptTitle: 'Choose how many to capture from opponent',
                mode: 'options',
                options: context => [...Array(Math.min(context.player.opponent.amber + 1, 11)).keys()].map(option => ({ name: option, value: option }))
            },
            gameAction: ability.actions.capture(context => ({
                condition: context => context.option && context.option.value > 0,
                amount: context.option && context.option.value
            })),
            then: thenContext => ({
                condition: () => thenContext.option.value < 10,
                target: {
                    activePromptTitle: 'Choose how many to capture from own side',
                    mode: 'options',
                    options: [...Array(11 - thenContext.option.value).keys()].map(option => ({ name: option, value: option }))
                },
                gameAction: ability.actions.capture(context => ({
                    ownController: true,
                    amount: context.option && context.option.value
                })),
                then: {
                    condition: context => context.source.tokens.amber < 10,
                    gameAction: ability.actions.purge(),
                    message: 'purges {1} as it has less than 10 amber on it'
                },
                message: '{0} uses {1} to capture {3} amber from {0}, placing it on {1}',
                messageArgs: context => [context.option.name]
            })
        });
    }
}

Crassosaurus.id = 'crassosaurus';

module.exports = Crassosaurus;
