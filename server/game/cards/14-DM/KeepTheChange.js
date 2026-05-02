const Card = require('../../Card.js');

class KeepTheChange extends Card {
    // Play: Pay your opponent up to 6A. For each A paid this way, draw a card.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'select',
                activePromptTitle: 'How much amber would you like to pay your opponent?',
                choices: (() => {
                    const choices = { 0: () => true };
                    for (let amount = 1; amount <= 6; amount++) {
                        choices[String(amount)] = (context) => context.player.amber >= amount;
                    }
                    return choices;
                })()
            },
            effect: 'pay {1} {2} amber and draw {2} cards',
            effectArgs: (context) => [context.player.opponent, parseInt(context.select)],
            gameAction: [
                ability.actions.transferAmber((context) => ({
                    target: context.player,
                    amount: parseInt(context.select)
                })),
                ability.actions.draw((context) => ({
                    target: context.player,
                    amount: parseInt(context.select)
                }))
            ]
        });
    }
}

KeepTheChange.id = 'keep-the-change';

module.exports = KeepTheChange;
