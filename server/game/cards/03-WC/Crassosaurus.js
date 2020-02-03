const Card = require('../../Card.js');

class Crassosaurus extends Card {
    calculateOwnAmber(context) {
        return context.option && (context.option.value < 10) ? Math.min(context.player.amber, 10 - context.option.value) : 0;
    }

    calculateCapturedAmber(context) {
        return context.option && (context.option.value + this.calculateOwnAmber(context));
    }

    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            target: {
                activePromptTitle: 'Choose how many to capture from opponent',
                mode: 'options',
                autoSelect: true,
                options: context => {
                    let amber = context.player.amber;
                    let oppAmber = context.player.opponent.amber;

                    let minAmber = Math.max(0, 10 - amber);
                    let options = [];
                    for(let i = minAmber; i < oppAmber; ++i) {
                        options.push(i);
                    }

                    options.push(oppAmber);

                    return options.map(option => ({ name: option, value: option }));
                }
            },
            gameAction: ability.actions.sequential([
                ability.actions.capture(context => ({
                    amount: context.option && context.option.value
                })),
                ability.actions.capture(context => ({
                    ownController: true,
                    amount: this.calculateOwnAmber(context)
                })),
                ability.actions.conditional(({
                    condition: context => context.source.amber < 10,
                    trueGameAction: ability.actions.purge()
                }))
            ]),
            effect: 'capture {1} amber from {2}{3}{4} amber from {5}{6}',
            effectArgs: context => [
                context.option && context.option.value,
                context.player.opponent,
                context.source.amber + this.calculateCapturedAmber(context) < 10 ? ', ' : ' and ',
                this.calculateOwnAmber(context),
                context.player,
                context.source.amber + this.calculateCapturedAmber(context) < 10 ? ' and then purge it' : ''
            ]
        });
    }
}

Crassosaurus.id = 'crassosaurus';

module.exports = Crassosaurus;
