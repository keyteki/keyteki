const Card = require('../../Card.js');

class Crassosaurus extends Card {
    // Elusive.
    // Play: Capture 10 from any combination of players. Then, if Crassosaurus has fewer than 10 on it, purge Crassosaurus.
    calculateOwnAmber(context) {
        return context.option && context.option.value < 10
            ? Math.min(context.player.amber, 10 - context.option.value)
            : 0;
    }

    calculateCapturedAmber(context) {
        return context.option && context.option.value + this.calculateOwnAmber(context);
    }

    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                activePromptTitle: 'Choose how many to capture from opponent',
                mode: 'options',
                options: (context) => {
                    let amber = context.player.amber;
                    let oppAmber = Math.min(context.player.opponent.amber, 10);

                    let minAmber = Math.max(0, 10 - amber);
                    let options = [];

                    options.push({ name: '' + oppAmber, value: oppAmber });

                    for (let i = oppAmber - 1; i >= minAmber; --i) {
                        options.push({ name: '' + i, value: i });
                    }

                    return options;
                }
            },
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    amount: context.option && context.option.value
                })),
                ability.actions.capture((context) => ({
                    player: context.player,
                    amount: this.calculateOwnAmber(context)
                })),
                ability.actions.conditional({
                    condition: (context) => context.source.amber < 10,
                    trueGameAction: ability.actions.purge()
                })
            ]),
            effect: 'capture {1} amber from {2}{3}{4} amber from {5}{6}',
            effectArgs: (context) => [
                context.option && context.option.value,
                context.player.opponent,
                context.source.amber + this.calculateCapturedAmber(context) < 10 ? ', ' : ' and ',
                this.calculateOwnAmber(context),
                context.player,
                context.source.amber + this.calculateCapturedAmber(context) < 10
                    ? ' and then purge it'
                    : ''
            ]
        });
    }
}

Crassosaurus.id = 'crassosaurus';

module.exports = Crassosaurus;
