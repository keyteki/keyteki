import Card from '../../Card.js';

class GrizzledWyvern extends Card {
    // Play: Capture 6A from any combination of players. Then, if
    // Grizzled Wyvern has fewer than 6A on it, destroy it.
    calculateOwnAmber(context) {
        return context.option && context.option.value < 6
            ? Math.min(context.player.amber, 6 - context.option.value)
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
                    let oppAmber = Math.min(context.player.opponent.amber, 6);

                    let minAmber = Math.max(0, 6 - amber);
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
                    condition: (context) => context.source.amber < 6,
                    trueGameAction: ability.actions.destroy()
                })
            ]),
            effect: 'capture {1} amber from {2}{3}{4} amber from {5}{6}',
            effectArgs: (context) => [
                context.option && context.option.value,
                context.player.opponent,
                context.source.amber + this.calculateCapturedAmber(context) < 6 ? ', ' : ' and ',
                this.calculateOwnAmber(context),
                context.player,
                context.source.amber + this.calculateCapturedAmber(context) < 6
                    ? ' and then destroy it'
                    : ''
            ]
        });
    }
}

GrizzledWyvern.id = 'grizzled-wyvern';

export default GrizzledWyvern;
